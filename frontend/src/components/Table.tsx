import React, { useState } from 'react';
export default function Table({ columns, data }: { columns: {key:string; label:string}[], data: any[] }) {
  const [sortKey, setSortKey] = useState(columns[0]?.key || '');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  function sortBy(key: string){ if (sortKey === key) setOrder(order==='asc'?'desc':'asc'); else { setSortKey(key); setOrder('asc'); } }
  const sorted = [...data].sort((a:any,b:any)=>{ const av=a[sortKey], bv=b[sortKey]; return av<bv?(order==='asc'?-1:1):av>bv?(order==='asc'?1:-1):0; });
  return (
    <table className="min-w-full bg-white shadow rounded overflow-hidden">
      <thead className="bg-gray-100"><tr>
        {columns.map(c => <th key={c.key} className="px-4 py-2 text-left cursor-pointer" onClick={()=>sortBy(c.key)}>{c.label} {sortKey===c.key?(order==='asc'?'▲':'▼'):''}</th>)}
      </tr></thead>
      <tbody>{sorted.map((row,i)=>(<tr key={i} className="border-t">
        {columns.map(c => <td key={c.key} className="px-4 py-2">{row[c.key]}</td>)}
      </tr>))}</tbody>
    </table>
  );
}
