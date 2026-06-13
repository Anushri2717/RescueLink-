import React, {useEffect, useState} from 'react'
import Sidebar from './Sidebar'
import SOSButton from './SOSButton'
import api from '../services/api'

export default function Main(){
  const [profile,setProfile] = useState(null)

  async function load(){
    try{
      const res = await api.get('/user/me')
      setProfile(res.data)
    }catch(err){
      console.error(err)
    }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="app-shell">
      <Sidebar profile={profile} onRefresh={load} />
      <main className="main-area">
        <SOSButton />
      </main>
    </div>
  )
}
