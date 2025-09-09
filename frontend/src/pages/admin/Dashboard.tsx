import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; import { api } from '../../api/client';
export default function AdminDashboard() {
  const [m, setM] = useState<{users:number;stores:number;ratings:number}|null>(null);
  useEffect(()=>{ api('/api/admin/metrics').then(setM); }, []);
  return (<div>
    <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">Users: {m?.users ?? '...'}</div>
      <div className="bg-white p-4 rounded shadow">Stores: {m?.stores ?? '...'}</div>
      <div className="bg-white p-4 rounded shadow">Ratings: {m?.ratings ?? '...'}</div>
    </div>
    <div className="flex gap-4">
      <Link to="/admin/users" className="text-blue-600">Manage Users</Link>
      <Link to="/admin/stores" className="text-blue-600">Manage Stores</Link>
    </div>
  </div>);
}
