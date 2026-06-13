const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')

module.exports = ({ db })=>{
  const router = express.Router()

  router.post('/signup', async (req,res)=>{
    const { userid, password, name } = req.body
    await db.read()
    if(db.data.users.find(u=>u.userid===userid)) return res.status(400).json({ message:'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = { id:nanoid(), userid, name, password:hash, contacts:[], defaultMsg:'I need help. Please come.', createdAt: new Date().toISOString() }
    db.data.users.push(user)
    await db.write()
    res.json({ ok:true })
  })

  router.post('/login', async (req,res)=>{
    const { userid, password } = req.body
    await db.read()
    const user = db.data.users.find(u=>u.userid===userid)
    if(!user) return res.status(400).json({ message:'Invalid creds' })
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(400).json({ message:'Invalid creds' })
    const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn:'30d' })
    res.json({ token })
  })

  return router
}