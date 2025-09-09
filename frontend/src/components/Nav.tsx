import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
export default function Nav() {
  const { user, setUser } = useAuth(); const nav = useNavigate();
  async function logout() { await api('/api/auth/logout', { method: 'POST' }); setUser(null); nav('/login'); }
  return (
    <nav className="bg-white shadow px-4 py-3 flex gap-4 items-center">
      <Link to="/" className="font-semibold">Store Ratings</Link><div className="flex-1" />
      {!user && <Link to="/login" className="text-blue-600">Login</Link>}
      {user && (<>
        <span className="text-sm text-gray-600">Hi, {user.name}</span>
        <Link to="/change-password" className="text-blue-600">Change Password</Link>
        {user.role === 'ADMIN' && <Link to="/admin" className="text-blue-600">Admin</Link>}
        {user.role === 'OWNER' && <Link to="/owner" className="text-blue-600">Owner</Link>}
        <button onClick={logout} className="ml-3 text-red-600">Logout</button>
      </>)}
    </nav>
  );
}
