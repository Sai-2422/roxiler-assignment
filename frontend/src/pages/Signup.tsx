import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
export default function Signup() {
  const [name, setName] = useState('Normal User Sample Name Long');
  const [email, setEmail] = useState('user@demo.com');
  const [address, setAddress] = useState('123 User Street, City, Country');
  const [password, setPassword] = useState('User@123!');
  const [error, setError] = useState<string|null>(null);
  const { setUser } = useAuth(); const nav = useNavigate();
  async function submit(e: React.FormEvent){ e.preventDefault();
    try { const res = await api('/api/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, address, password }) });
      setUser(res.user); nav('/'); } catch(e:any){ setError(e.message); } }
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h1 className="text-xl font-semibold mb-4">Sign Up</h1>{error && <div className="text-red-600 mb-2">{error}</div>}
    <form onSubmit={submit} className="space-y-3">
      <input className="border p-2 w-full" placeholder="Name (20-60 chars)" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Address (max 400 chars)" value={address} onChange={e=>setAddress(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Password (8–16, 1 uppercase, 1 special)" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Create Account</button>
    </form>
  </div>);
}
