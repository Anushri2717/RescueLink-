const express = require('express')
const auth = require('../middleware/auth')
const twilioClient = require('twilio')

module.exports = ({ db })=>{
  const router = express.Router()
  router.use(auth)

  router.post('/send', async (req,res)=>{
    await db.read()
    const user = db.data.users.find(u=>u.id===req.userId)
    if(!user) return res.status(404).json({ message:'User not found' })
    const { lat, lon } = req.body || {}
    const msg = user.defaultMsg || 'I need help.'
    const body = `${msg}\nLocation:${ lat && lon ? `https://www.google.com/maps?q=${lat},${lon}` : 'Unavailable' }`;

    // save history
    db.data.history.push({ id: Date.now(), userId: user.id, body, recipients: user.contacts, time: new Date().toISOString() })
    await db.write()

    // Twilio SMS
    if(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM){
      try{
        const client = twilioClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
        const results = []
        for(const to of (user.contacts||[])){
          const r = await client.messages.create({ from: process.env.TWILIO_FROM, to, body })
          results.push(r.sid)
        }
        return res.json({ ok:true, sent: results })
      }catch(err){
        console.error('Twilio error', err.message)
        return res.status(500).json({ message:'Failed to send via Twilio', detail: err.message })
      }
    }

    // Fallback if Twilio not configured
    res.json({ ok:false, message:'No SMS provider configured on server; use client SMS fallback', payload:{ body, recipients: user.contacts } })
  })

  return router
}
