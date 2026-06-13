import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Signup(){
  const [userid,setUserid] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    await api.post('/auth/signup',{ userid, password, name })
    alert('Account created. Please login')
    nav('/login')
  }

  return (
    <div className="auth-page">
      <form className="card" onSubmit={submit}>
        <h2>Sign up</h2>
        <input placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="userid" value={userid} onChange={e=>setUserid(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}
