import React, {useState} from 'react'
import api from '../services/api'

export default function SOSButton(){
  const [sending, setSending] = useState(false)

  async function sendSOS(){
    setSending(true)
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async (pos)=>{
        try{
          const payload = { lat: pos.coords.latitude, lon: pos.coords.longitude }
          await api.post('/sos/send', payload)
          alert('SOS sent (server attempted SMS/WhatsApp).')
        }catch(err){
          alert('Failed to send via server. Attempting SMS fallback...')
          smsFallback()
        }
        setSending(false)
      }, (err)=>{
        alert('Location denied or unavailable. Will send without exact coords.')
        smsFallback()
        setSending(false)
      })
    }else{
      smsFallback()
      setSending(false)
    }
  }

  function smsFallback(){
    api.get('/user/me').then(res=>{
      const contacts = res.data.contacts || []
      const msg = encodeURIComponent((res.data.defaultMsg||'I need help') + '\nMy approximate location:');
      if(contacts.length===0){ alert('No contacts set. Please add contacts.') ; return }
      const recipients = contacts.join(',')
      window.location.href = `sms:${recipients}?&body=${msg}`
    })
  }

  return (
    <div className="sos-wrap">
      <button className="sos-button" onClick={sendSOS} disabled={sending}>{ sending ? 'Sending...' : 'SOS' }</button>
      <p className="hint">Tap and hold when emergency — location and message sent to chosen contacts.</p>
    </div>
  )
}
