import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
export default function AdminStores() {
  const [query, setQuery] = useState(''); const [stores, setStores] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  async function load(){ const res = await api(`/api/admin/stores?query=${encodeURIComponent(query)}`); setStores(res.stores); }
  useEffect(()=>{ load(); }, []);
  async function createStore(e: React.FormEvent){ e.preventDefault(); await api('/api/admin/stores', { method: 'POST', body: JSON.stringify(form) }); setForm({ name:'', email:'', address:'' }); await load(); }
  return (<div>
    <h1 className="text-xl font-semibold mb-4">Stores</h1>
    <div className="flex gap-2 mb-3">
      <input className="border p-2" placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} />
      <button onClick={load} className="bg-blue-600 text-white px-3 rounded">Search</button>
    </div>
    <form onSubmit={createStore} className="bg-white p-4 rounded shadow mb-4 space-y-2">
      <div className="font-semibold">Create Store</div>
      <input className="border p-2 w-full" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
      <input className="border p-2 w-full" placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
      <input className="border p-2 w-full" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
      <button className="bg-green-600 text-white px-3 py-1 rounded">Create</button>
    </form>
    <table className="min-w-full bg-white shadow rounded overflow-hidden"><thead className="bg-gray-100"><tr>
      <th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Address</th><th className="px-4 py-2 text-left">Overall Rating</th>
    </tr></thead><tbody>{stores.map(s=>(
      <tr key={s.id} className="border-t">
        <td className="px-4 py-2">{s.name}</td><td className="px-4 py-2">{s.email || '-'}</td><td className="px-4 py-2">{s.address}</td><td className="px-4 py-2">{(s.overall_rating ?? 0).toFixed(2)}</td>
      </tr>
    ))}</tbody></table>
  </div>);
}
