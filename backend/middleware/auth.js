const jwt = require('jsonwebtoken')
module.exports = async function(req,res,next){
  const auth = req.headers.authorization
  if(!auth) return res.status(401).json({ message:'Missing auth' })
  const token = auth.split(' ')[1]
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret123')
    req.userId = payload.id
    next()
  }catch(err){ res.status(401).json({ message:'Invalid token' }) }
}