import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
type Store = { id:string; name:string; address:string; overall_rating:number; my_rating:number|null };
export default function Stores() {
  const [name, setName] = useState(''); const [address, setAddress] = useState('');
  const [stores, setStores] = useState<Store[]>([]); const [error, setError] = useState<string|null>(null);
  async function load(){ try { const res = await api(`/api/stores?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`); setStores(res.stores); } catch(e:any){ setError(e.message); } }
  useEffect(()=>{ load(); }, []);
  async function submitRating(id: string, stars: number) {
    try { await api(`/api/stores/${id}/ratings`, { method: 'POST', body: JSON.stringify({ stars }) }); await load(); }
    catch (e:any) {
      if (e.message.includes('already rated')) { await api(`/api/stores/${id}/ratings`, { method: 'PATCH', body: JSON.stringify({ stars }) }); await load(); }
      else setError(e.message);
    }
  }
  return (<div><h1 className="text-xl font-semibold mb-3">Stores</h1>
    <div className="flex gap-2 mb-3">
      <input className="border p-2" placeholder="Search name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border p-2" placeholder="Search address" value={address} onChange={e=>setAddress(e.target.value)} />
      <button onClick={load} className="bg-blue-600 text-white px-3 rounded">Search</button>
    </div>
    {error && <div className="text-red-600 mb-2">{error}</div>}
    <table className="min-w-full bg-white shadow rounded overflow-hidden"><thead className="bg-gray-100"><tr>
      <th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Address</th>
      <th className="px-4 py-2 text-left">Overall Rating</th><th className="px-4 py-2 text-left">My Rating</th><th className="px-4 py-2 text-left">Action</th>
    </tr></thead><tbody>{stores.map(s=>(
      <tr key={s.id} className="border-t">
        <td className="px-4 py-2">{s.name}</td><td className="px-4 py-2">{s.address}</td>
        <td className="px-4 py-2">{(s.overall_rating||0).toFixed(2)}</td><td className="px-4 py-2">{s.my_rating ?? '-'}</td>
        <td className="px-4 py-2">{[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>submitRating(s.id,n)} className="px-2 py-1 border rounded mr-1">{n}</button>))}</td>
      </tr>
    ))}</tbody></table>
  </div>);
}
