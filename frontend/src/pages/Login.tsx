import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin@123!');
  const [error, setError] = useState<string|null>(null);
  const { setUser } = useAuth(); const nav = useNavigate();
  async function submit(e: React.FormEvent){ e.preventDefault();
    try { const res = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setUser(res.user); nav('/'); } catch(e:any){ setError(e.message); } }
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h1 className="text-xl font-semibold mb-4">Login</h1>{error && <div className="text-red-600 mb-2">{error}</div>}
    <form onSubmit={submit} className="space-y-3">
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
    <p className="text-sm mt-2">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
  </div>);
}
