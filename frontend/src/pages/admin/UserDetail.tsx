import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; import { api } from '../../api/client';
export default function AdminUserDetail() {
  const { id } = useParams(); const [data, setData] = useState<any>(null);
  useEffect(()=>{ api(`/api/admin/users/${id}`).then(setData); }, [id]);
  if (!data) return <div>Loading...</div>;
  return (<div className="bg-white p-4 rounded shadow">
    <h1 className="text-xl font-semibold mb-2">User Detail</h1>
    <div>Name: {data.user.name}</div><div>Email: {data.user.email}</div><div>Address: {data.user.address}</div><div>Role: {data.user.role}</div>
    {data.user.role === 'OWNER' && <div>Store Average Rating: {data.ownerRating?.toFixed(2)}</div>}
  </div>);
}
