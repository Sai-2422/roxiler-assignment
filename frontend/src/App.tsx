import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminStores from './pages/admin/Stores';
import Stores from './pages/Stores';
import OwnerDashboard from './pages/owner/Dashboard';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  return (
    <div>
      <Nav />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={user ? <Stores /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetail />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/owner" element={<OwnerDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
