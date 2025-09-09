import React, { createContext, useContext, useState } from 'react';
type User = { id: string; email: string; role: 'ADMIN'|'USER'|'OWNER'; name: string; address: string } | null;
type Ctx = { user: User; setUser: (u: User) => void };
const AuthContext = createContext<Ctx>({ user: null, setUser: () => {} });
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};
export function useAuth() { return useContext(AuthContext); }
