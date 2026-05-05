import { useState } from 'react';
import type { SignupFormData, AdminData } from '../types';

interface CreateAdminProps {
    signupList?: SignupFormData[]
    onAdd: (form: SignupFormData & { role: string }) => void
    data?: AdminData[]
}

function CreateAdmin({ signupList = [], onAdd, data = [] }: CreateAdminProps) {
  const [search, setSearch]   = useState('');
  const [found, setFound]     = useState<SignupFormData | null>(null);   
  const [role, setRole]       = useState('');
  const [error, setError]     = useState('');
  const [notFound, setNotFound] = useState(false);

  const nextId = String(data.length + 1).padStart(4, '0');

  const handleSearch = () => {
    const result = signupList.find(
      u => u.email.toLowerCase() === search.toLowerCase()
    );
    if (result) {
      setFound(result);
      setNotFound(false);
      setError('');
    } else {
      setFound(null);
      setNotFound(true);
    }
  };

  const handleAdd = () => {
    if (!found) {
      setError('กรุณาค้นหา email ก่อน');
      return;
    }
    if (!role) {
      setError('กรุณาเลือก Role');
      return;
    }
    onAdd({ ...found, role });
    setSearch('');
    setFound(null);
    setRole('');
    setError('');
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={s.toolbar}>
        <button style={s.headerBtn}>ADD ADMIN</button>
      </div>

      <div style={s.body}>
        {/* ซ้าย — Search */}
        <div style={s.left}>
          <div style={s.srch}>
            <span style={{ fontSize: '18px', color: '#888' }}>&#128269;</span>
            <input
              style={s.srchInput}
              placeholder="BY EMAIL"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button style={s.srchBtn} onClick={handleSearch}>ค้นหา</button>
          {notFound && <div style={s.notFound}>ไม่พบ email นี้ในระบบ</div>}
        </div>

        {/* ขวา — ฟอร์มข้อมูล */}
        <div style={s.right}>
          <div style={s.userId}>USER ID: {nextId}</div>

          <div style={s.grid}>
            <InfoField label="FULL NAME" value={found ? found.fullname : ''} />
            <InfoField label="PHONE"     value={found ? found.phone : ''} />
            <InfoField label="BIRTHDATE" value={found ? found.birthdate : ''} />
            <InfoField label="USERNAME"   value={found ? found.username  : ''} />
            <InfoField label="EMAIL"      value={found ? found.email     : ''} />
          </div>

          {/* Role */}
          <div style={s.roleWrap}>
            <div style={s.roleLabel}>ROLE</div>
            <select
              style={s.select}
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="">choose role</option>
              <option value="SUPER ADMIN">SUPER ADMIN</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          {error && <div style={s.error}>{error}</div>}

          {/* Add Button */}
          <div style={{ textAlign: 'right', marginTop: '16px' }}>
            <button style={s.addBtn} onClick={handleAdd}>ADD</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoFieldProps {
    label: string
    value: string
    filled?: boolean
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div style={f.wrap}>
      <div style={f.label}>{label}</div>
      <div style={f.value}>{value}</div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  toolbar:   { marginBottom: '20px', marginTop: '70px'},
  headerBtn: { background: '#e85d00', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 24px', fontSize: '22px', fontWeight: '700', cursor: 'pointer' },
  body:      { display: 'flex', gap: '32px', alignItems: 'flex-start' },
  left:      { display: 'flex', flexDirection: 'column', gap: '10px', width: '350px', flexShrink: 0 },
  srch:      { display: 'flex', alignItems: 'center', gap: '8px', background: '#f5e6d5', border: '1.5px solid #d0a080', borderRadius: '24px', padding: '10px 16px' },
  srchInput: { border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', width: '100%', color: '#333' },
  srchBtn:   { background: '#e85d00', color: '#fff', border: 'none', borderRadius: '20px', padding: '8px 20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' },
  notFound:  { color: '#c0392b', fontSize: '13px' },
  right:     { flex: 1 },
  userId:    { fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '20px' },
  grid:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: '16px' },
  roleWrap:  { display: 'flex', flexDirection: 'column', gap: '6px', width: '50%' },
  roleLabel: { fontSize: '18px', fontWeight: '700', color: '#333' },
  select:    { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '18px', background: '#fff', outline: 'none' },
  error:     { color: '#c0392b', fontSize: '13px', marginTop: '8px' },
  addBtn:    { background: '#e85d00', color: '#fff', border: 'none', borderRadius: '20px', padding: '10px 40px', fontSize: '20px', fontWeight: '700', cursor: 'pointer' },
};

const f: Record<string, React.CSSProperties> = {
  wrap:  { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '18px', fontWeight: '700', color: '#333' },
  value: {
    background: '#fff',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    minHeight: '36px',
    color: '#333'
  },
};

export default CreateAdmin;