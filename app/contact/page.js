'use client'
import { useState } from 'react'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e){
    e.preventDefault()
    await fetch('/api/contact', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({name,email,msg}) })
    setDone(true)
  }

  return (
    <section>
      <h2 className="text-2xl font-bold">Contact</h2>
      {done ? <div className="mt-4 text-slate-300">Thanks — I will reply within 48 hours.</div> : (
      <form onSubmit={submit} className="mt-4 grid gap-3 max-w-md">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="p-3 rounded bg-slate-800" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-3 rounded bg-slate-800" />
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Message" className="p-3 rounded bg-slate-800" rows={6} />
        <button className="px-4 py-2 bg-primary rounded text-black">Send</button>
      </form>)}
    </section>
  )
}
