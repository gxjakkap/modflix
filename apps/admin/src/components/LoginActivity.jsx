import React, { useState } from 'react';
import Dropdown from './Dropdown';
import Pagination from './Pagination';
import SearchBar from './SearchBar'; 


const ACTIONS = ['View Details', 'Block IP', 'More Activity'];

const riskStyle = {
  LOW:    { background: '#eaf3de', color: '#3B6D11' },
  HIGH:   { background: '#FCEBEB', color: '#A32D2D' },
  MEDIUM: { background: '#FAEEDA', color: '#854F0B' },
};

function LoginActivity({data, onDelete}) {
  const [page, setPage] = useState(1);

  const PER_PAGE   = 5;
  const totalPages = Math.ceil(data.length / PER_PAGE);
  const paged      = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div style={{ marginBottom: '30px', marginTop: '70px' }}>
        <SearchBar />
      </div>

      <table style={s.table}>
        <thead>
          <tr style={s.thead}>
            {['ID','NAME','TIME','EVENT','IP','LAST ACT.','RISK',''].map(h => (
              <th key={h} style={s.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paged.map(r => (
            <tr key={r.id} style={s.tr}>
              <td style={s.td}>{r.id}</td>
              <td style={s.td}>{r.name}</td>
              <td style={s.td}>{r.time}</td>
              <td style={s.td}>{r.event}</td>
              <td style={s.td}>{r.ip}</td>
              <td style={s.td}>{r.last}</td>
              <td style={s.td}>
                <span style={{ ...s.badge, ...riskStyle[r.risk] }}>{r.risk}</span>
              </td>
              <td style={{ ...s.td, position: 'relative' }}>
                <Dropdown
                  actions={ACTIONS}
                  onDelete={() => onDelete(r.id)}  // ✅ ส่ง id ที่จะลบ
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

export default LoginActivity;

const s = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '16px', tableLayout: 'fixed' },
  thead: { background: '#e85d00' },
  th:    { padding: '8px', textAlign: 'left', color: '#fff', fontWeight: '600', fontSize: '18px' },
  tr:    { borderBottom: '1px solid #9f9f82' },
  td:    { padding: '10px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '16px' },
  badge: { display: 'inline-block', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '600' },
};