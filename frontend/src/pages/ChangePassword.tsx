import React, { useState } from 'react';
import { api } from '../api/client';
export default function ChangePassword() {
  const [oldPassword, setOld] = useState('Admin@123!');
  const [newPassword, setNew] = useState('Admin@123!');
  const [msg, setMsg] = useState<string|null>(null);
  async function submit(e: React.FormEvent){ e.preventDefault();
    await api('/api/auth/change-password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) });
    setMsg('Password updated.'); }
  return (<div className="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h1 className="text-xl font-semibold mb-4">Change Password</h1>{msg && <div className="text-green-700 mb-2">{msg}</div>}
    <form onSubmit={submit} className="space-y-3">
      <input className="border p-2 w-full" placeholder="Old password" value={oldPassword} onChange={e=>setOld(e.target.value)} />
      <input className="border p-2 w-full" placeholder="New password" value={newPassword} onChange={e=>setNew(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
    </form>
  </div>);
}
