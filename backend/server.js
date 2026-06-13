require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Low } = require('lowdb')
const { JSONFile } = require('lowdb/node')
const path = require('path')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// LowDB setup
const file = path.join(__dirname,'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

;(async ()=>{
  await db.read()
  db.data ||= { users: [], history: [] }
  await db.write()
})()

const authRoutes = require('./routes/auth')({ db })
const userRoutes = require('./routes/user')({ db })
const sosRoutes = require('./routes/sos')({ db })

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/sos', sosRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('Server listening on', PORT))
