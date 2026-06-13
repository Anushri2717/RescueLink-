const express = require('express')
const auth = require('../middleware/auth')
module.exports = ({ db })=>{
  const router = express.Router()
  router.use(auth)

  router.get('/me', async (req,res)=>{
    await db.read()
    const user = db.data.users.find(u=>u.id===req.userId)
    if(!user) return res.status(404).json({ message:'User not found' })
    res.json({ id:user.id, name:user.name, userid:user.userid, contacts:user.contacts, defaultMsg:user.defaultMsg })
  })

  router.post('/settings', async (req,res)=>{
    await db.read()
    const user = db.data.users.find(u=>u.id===req.userId)
    if(!user) return res.status(404).json({ message:'User not found' })
    const { contacts, defaultMsg } = req.body
    if(contacts) user.contacts = contacts
    if(defaultMsg) user.defaultMsg = defaultMsg
    await db.write()
    res.json({ ok:true })
  })

  return router
}
