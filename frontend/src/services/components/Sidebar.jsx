import React, {useState} from 'react'
import api from '../services/api'

export default function Sidebar({profile, onRefresh}){
  const [editing, setEditing] = useState(false)
  const [defaultMsg, setDefaultMsg] = useState(profile?.defaultMsg || 'I need help')

  async function save(){
    await api.post('/user/settings',{ defaultMsg })
    setEditing(false)
    onRefresh()
  }

  function logout(){
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <aside className="sidebar">
      <div className="profile">
        <div className="avatar">{profile?.name?.[0] || '?'}</div>
        <div>{profile?.name || 'No name'}</div>
      </div>

      <nav>
        <button onClick={()=>setEditing(s=>!s)}>Edit</button>
        <button onClick={()=>document.getElementById('contacts-panel').classList.toggle('show')}>Contact</button>
        <button onClick={()=>alert('Location panel — requests location permission when sending SOS')}>Location</button>
        <button onClick={()=>alert('History — stored on backend')}>History</button>
        <button onClick={()=>alert('Settings')}>Settings</button>
        <button onClick={()=>alert('About: SOS app demo')}>About</button>
        <button onClick={logout}>Logout</button>
      </nav>

      <div className={"contacts-panel"} id="contacts-panel">
        <h4>Choose contacts (comma separated numbers)</h4>
        <textarea id="contacts-input" defaultValue={profile?.contacts?.join(',')||''}></textarea>
        <button onClick={async()=>{
          const val = document.getElementById('contacts-input').value
          const arr = val.split(',').map(s=>s.trim()).filter(Boolean)
          await api.post('/user/settings',{ contacts: arr })
          alert('Saved')
          onRefresh()
        }}>Save Contacts</button>
      </div>

      {editing && (
        <div className="edit-box">
          <h4>Edit default message</h4>
          <input value={defaultMsg} onChange={e=>setDefaultMsg(e.target.value)} />
          <button onClick={save}>Save</button>
        </div>
      )}
    </aside>
  )
}
