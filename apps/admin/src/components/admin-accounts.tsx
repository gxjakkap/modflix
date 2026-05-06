import { useState } from 'react';
import Dropdown from './Dropdown';
import Pagination from './Pagination';
import SearchBar from './search-bar'; 
import type { AdminData } from '../types';


const ACTIONS = ['Delete', 'Suspend'];

interface AdminAccountsProps {
    data: AdminData[]
    onAddAdmin: () => void
    onDelete: (id: string) => void
}

function AdminAccounts({ data, onAddAdmin, onDelete }: AdminAccountsProps) {
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const PER_PAGE = 5;

  const filtered = data.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div style={s.toolbar}>
        <SearchBar value={search} onChange={setSearch} />
        <button style={s.btn} onClick={onAddAdmin}>ADD ADMIN +</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr style={s.thead}>
            <Th w="8%">ID</Th>
            <Th w="18%">NAME</Th>
            <Th w="14%">ROLE</Th>
            <Th w="20%">LAST LOGIN</Th>
            <Th w="28%">EMAIL</Th>
            <Th w="12%"></Th>
          </tr>
        </thead>
        <tbody>
          {paged.map(a => (
            <tr key={a.id} style={s.tr}>
              <td style={s.td}>{a.id}</td>
              <td style={s.td}>{a.name}</td>
              <td style={s.td}>{a.role}</td>
              <td style={s.td}>{a.login}</td>
              <td style={s.td}>{a.email}</td>
              <td style={{ ...s.td, position: 'relative' }}>
                <Dropdown
                  actions={ACTIONS}
                  onDelete={() => onDelete(a.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

       <Pagination current={page} total={totalPages} onChange={setPage} />
    </div>
  );
}

interface ThProps {
    children?: React.ReactNode
    w?: string
}

const Th = ({ children, w }: ThProps) => (
  <th style={{ ...s.th, width: w || 'auto' }}>{children}</th>
);

export default AdminAccounts;

const s: Record<string, React.CSSProperties> = {
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '30px'},
  btn:     { background: '#e85d00', color: '#fff', border: 'none', borderRadius: '20px', padding: '7px 14px', fontSize: '18px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '16px' }, 
  th:    { padding: '10px', textAlign: 'left', color: '#fff', fontWeight: '600', fontSize: '18px' }, 
  td:    { padding: '10px', color: '#333', fontSize: '16px' },
  thead:   { background: '#e85d00' },
  tr:      { borderBottom: '1px solid #9f9f82' }
};
