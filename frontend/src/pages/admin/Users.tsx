import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; import { api } from '../../api/client';
export default function AdminUsers() {
  const [query, setQuery] = useState(''); const [role, setRole] = useState(''); const [users, setUsers] = useState<any[]>([]);
  async function load(){ const res = await api(`/api/admin/users?query=${encodeURIComponent(query)}&role=${encodeURIComponent(role)}`); setUsers(res.users); }
  useEffect(()=>{ load(); }, []);
  return (<div>
    <h1 className="text-xl font-semibold mb-4">Users</h1>
    <div className="flex gap-2 mb-3">
      <input className="border p-2" placeholder="Search" value={query} onChange={e=>setQuery(e.target.value)} />
      <select className="border p-2" value={role} onChange={e=>setRole(e.target.value)}>
        <option value="">All roles</option><option value="ADMIN">ADMIN</option><option value="USER">USER</option><option value="OWNER">OWNER</option>
      </select>
      <button onClick={load} className="bg-blue-600 text-white px-3 rounded">Search</button>
    </div>
    <table className="min-w-full bg-white shadow rounded overflow-hidden"><thead className="bg-gray-100"><tr>
      <th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Address</th><th className="px-4 py-2 text-left">Role</th>
    </tr></thead><tbody>{users.map(u=>(
      <tr key={u.id} className="border-t">
        <td className="px-4 py-2"><Link to={`/admin/users/${u.id}`} className="text-blue-600">{u.name}</Link></td>
        <td className="px-4 py-2">{u.email}</td><td className="px-4 py-2">{u.address}</td><td className="px-4 py-2">{u.role}</td>
      </tr>
    ))}</tbody></table>
  </div>);
}
