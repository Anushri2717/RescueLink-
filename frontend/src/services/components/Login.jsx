import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login(){
  const [userid,setUserid] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/auth/login',{ userid, password })
      localStorage.setItem('token', res.data.token)
      nav('/app')
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  function googleSignIn(){
    alert('Google Sign-In: please integrate Google Identity Client ID in frontend code and backend OAUTH. Placeholder for demo.')
  }

  return (
    <div className="auth-page">
      <form className="card" onSubmit={submit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input placeholder="userid" value={userid} onChange={e=>setUserid(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
        <button type="button" onClick={googleSignIn}>Continue with Google</button>
        <p>Don't have account? <Link to="/signup">Sign up</Link></p>
      </form>
    </div>
  )
}
