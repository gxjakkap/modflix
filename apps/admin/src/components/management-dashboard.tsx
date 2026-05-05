import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import AdminAccounts from './admin-accounts';
import Sessions from './sessions';
import LoginActivity from './login-activity';
import CreateAdmin from './create-admin';
import Navbar from "./navbar";
import mockProfilePic from '../assets/rigbyMockProfilePic.png'
import type { AdminData, SignupFormData } from '../types';

interface ManagementDashboardProps {
    data: AdminData[]
    signupList: SignupFormData[]
    handleDelete: (id: string) => void
    handleAddAdmin: (newAdmin: SignupFormData & { role: string }) => void
    user: SignupFormData | null
    pic: string
    username: string
}

function ManagementDashboard({ data, handleDelete, handleAddAdmin, signupList, pic, username }: ManagementDashboardProps) {
  const navigate = useNavigate();

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
                <Route path="create-admin"   element={<CreateAdmin signupList={signupList} data={data} onAdd={(form) => { handleAddAdmin(form); navigate('/management/admin'); }} />} />
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

  Management: {
    color: '#fff',
    margin: '20px 0px 45px 200px',
    fontSize:'40px'
  }
};

export default ManagementDashboard;
