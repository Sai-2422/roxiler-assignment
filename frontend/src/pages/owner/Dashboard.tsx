import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
export default function OwnerDashboard() {
  const [ratings, setRatings] = useState<any[]>([]); const [avg, setAvg] = useState<number>(0); const [storeName, setStoreName] = useState<string>('');
  useEffect(()=>{
    api('/api/owner/my-store/ratings').then(r=>{ setRatings(r.ratings); setStoreName(r.store?.name || ''); });
    api('/api/owner/my-store/average-rating').then(r=> setAvg(r.average));
  }, []);
  return (<div>
    <h1 className="text-xl font-semibold mb-4">Owner Dashboard {storeName && `— ${storeName}`}</h1>
    <div className="bg-white p-4 rounded shadow mb-4">Average rating: {avg.toFixed(2)}</div>
    <table className="min-w-full bg-white shadow rounded overflow-hidden"><thead className="bg-gray-100"><tr>
      <th className="px-4 py-2 text-left">User</th><th className="px-4 py-2 text-left">Email</th><th className="px-4 py-2 text-left">Stars</th><th className="px-4 py-2 text-left">When</th>
    </tr></thead><tbody>{ratings.map((r,i)=>(
      <tr key={i} className="border-t"><td className="px-4 py-2">{r.user.name}</td><td className="px-4 py-2">{r.user.email}</td><td className="px-4 py-2">{r.stars}</td><td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td></tr>
    ))}</tbody></table>
  </div>);
}
