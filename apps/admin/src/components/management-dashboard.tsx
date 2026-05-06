import { useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import AdminAccounts from './admin-accounts';
import Sessions from './Sessions';
import LoginActivity from './login-activity';
import CreateAdmin from './create-admin';
import Navbar from "./navbar";
import mockProfilePic from '../assets/rigbyMockProfilePic.png'
import type { AdminData } from '../types';

// ✅ ย้าย INITIAL_DATA มาไว้ที่นี่
const INITIAL_DATA: AdminData[] = [
  { id: '0001', name: 'KIM MINJEONG', role: 'SUPER ADMIN', login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '203.0.113.1', last: '1 min ago',  risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
  { id: '0002', name: 'NUCH',         role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Phone',   ip: '101.51.22.9', last: '5 min ago',  risk: 'HIGH',   time: 'MAR 23, 10:15', event: 'LOGIN' },
  { id: '0003', name: 'LISA',         role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Windows', ip: '101.51.22.9', last: '1 min ago',  risk: 'MEDIUM', time: 'MAR 23, 10:15', event: 'LOGIN' },
  { id: '0004', name: 'JENNIE',       role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '203.0.113.1', last: '2 days ago', risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
  { id: '0005', name: 'KARINA',       role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '101.51.22.9', last: '1 min ago',  risk: 'LOW',    time: 'MAR 23, 10:15', event: 'LOGIN' },
  { id: '0006', name: 'NINGNING',     role: 'ADMIN',       login: '12/12/24 01:03 PM', email: 'winrina@gmail.com', device: 'Mac',     ip: '101.51.22.9', last: '5 min ago',  risk: 'MEDIUM', time: 'MAR 23, 10:15', event: 'LOGIN' },
];

// ✅ interface เหลือแค่ pic และ username
interface ManagementDashboardProps {
  pic: string
  username: string
}

function ManagementDashboard({ pic, username }: ManagementDashboardProps) {
  // ✅ state และ handlers อยู่ใน component
  const [data, setData] = useState<AdminData[]>(INITIAL_DATA);
  const navigate        = useNavigate();

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const handleAddAdmin = (newAdmin: { fullname: string; email: string; role: string }) => {
    const nextId  = String(data.length + 1).padStart(4, '0');
    const now     = new Date();
    const dateStr = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const months  = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const timeStr = `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    setData(prev => [...prev, {
      id:     nextId,
      name:   newAdmin.fullname.toUpperCase(),
      role:   newAdmin.role || 'ADMIN',
      login:  dateStr,
      email:  newAdmin.email,
      device: 'Mac',
      ip:     '192.168.1.1',
      last:   '1 min ago',
      risk:   'LOW' as const,
      time:   timeStr,
      event:  'LOGIN',
    }]);
  };

  return (
    <>
      <Navbar pic={pic || mockProfilePic} username={username || 'LetmeuseKase'} />
      <h1 style={s.Management}>Management</h1>
      <div style={s.dash}>
        <div style={s.tabs}>
          <NavLink to="/management/admin"          style={({ isActive }) => isActive ? s.tabOn : s.tab}>ADMIN ACCOUNTS</NavLink>
          <NavLink to="/management/sessions"       style={({ isActive }) => isActive ? s.tabOn : s.tab}>SESSIONS</NavLink>
          <NavLink to="/management/login-activity" style={({ isActive }) => isActive ? s.tabOn : s.tab}>LOGIN ACTIVITY</NavLink>
        </div>
        <div style={s.card}>
          <Routes>
            <Route path="admin"          element={<AdminAccounts data={data} onAddAdmin={() => navigate('/management/create-admin')} onDelete={handleDelete} />} />
            <Route path="sessions"       element={<Sessions data={data} onDelete={handleDelete} />} />
            <Route path="login-activity" element={<LoginActivity data={data} onDelete={handleDelete} />} />
            <Route path="create-admin"   element={<CreateAdmin data={data} onAdd={(form) => { handleAddAdmin(form); navigate('/management/admin'); }} />} />
            <Route path="*"              element={<Navigate to="/management/admin" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  dash: {
    background: 'transparent',
    minHeight: '100vh',
    fontFamily: "'Noto Sans Thai Looped', sans-serif",
    position: 'relative',
    width: '90%',
    maxWidth: '1440px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5%',
  },
  tabs: {
    display: 'flex',
    gap: '9px',
    marginBottom: '0px',
    position: 'relative',
    zIndex: 1,
  },
  tab: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px 8px 0px 0px',
    fontSize: '20px',
    fontWeight: '700',
    border: 'none',
    background: '#5a1a00',
    color: '#fff',
    letterSpacing: '0.5px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
  },
  tabOn: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px 8px 0px 0px',
    fontSize: '20px',
    fontWeight: '700',
    border: 'none',
    background: '#e85d00',
    color: '#fff',
    letterSpacing: '0.5px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
  },
  card: {
    background: '#FFD7B5',
    borderRadius: '0px 0px 50px 50px',
    minHeight: '670px',
    padding: '20px 3% 40px 3%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  Management: {
    color: '#fff',
    margin: '20px 0px 45px 200px',
    fontSize: '40px',
  },
};

export default ManagementDashboard;