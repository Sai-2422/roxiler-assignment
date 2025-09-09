export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers||{}) }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || res.statusText);
  return res.json();
}
