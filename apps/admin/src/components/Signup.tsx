import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from './Background';
import logoPic from '../assets/Logo.png';  
import closeEye from '../assets/closepassword.png';  
import openEye  from '../assets/openpassword.png';   
import type { SignupFormData } from '../types';

interface SignupProps {
    onSignup: (formData: SignupFormData) => void
    onLoginSuccess: () => void
}

function Signup({ onSignup, onLoginSuccess }: SignupProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupFormData>({
    email: '',
    fullname: '',
    username: '',
    phone: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]             = useState('');

  const handleChange = (field: keyof SignupFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.email || !form.fullname || !form.username || !form.phone || !form.birthdate || !form.password) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password ไม่ตรงกัน');
      return;
    }
    onSignup(form);
    onLoginSuccess(); 
    navigate('/');
  };

  return (
    <div style={s.page}>
      <Background />

      <div style={s.inner}>
        <div style={s.logoWrap}>
          <img src={logoPic} style={s.logo} alt="logo" />
        </div>

        <div style={s.card}>
          {error && <div style={s.error}>{error}</div>}
          <Field label="Email"            value={form.email}           onChange={v => handleChange('email', v)} type="email" />
          <Field label="Username"         value={form.username}        onChange={v => handleChange('username', v)} />
          <Field
            label="Full Name"
            value={form.fullname}
            onChange={v => handleChange('fullname', v)}
          />

          <Field
            label="Phone"
            value={form.phone}
            onChange={v => handleChange('phone', v)}
          />

          <Field
            label="Birthdate"
            value={form.birthdate}
            onChange={v => handleChange('birthdate', v)}
            type="date"
          />
          <Field
            label="Create Password"
            value={form.password}
            onChange={v => handleChange('password', v)}
            type={showPass ? 'text' : 'password'}
            onToggle={() => setShowPass(p => !p)}
            showToggle
          />
          <Field
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={v => handleChange('confirmPassword', v)}
            type={showConfirm ? 'text' : 'password'}
            onToggle={() => setShowConfirm(p => !p)}
            showToggle
          />
        </div>

        <button style={s.btn} onClick={handleSubmit}>SIGNUP</button>
      </div>
    </div>
  );
}

interface FieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    type?: string
    showToggle?: boolean
    onToggle?: () => void
}

function Field({ label, value, onChange, type = 'text', showToggle, onToggle }: FieldProps) {
  return (
    <div style={f.row}>
      <label style={f.label}>{label}</label>
      <div style={f.inputWrap}>
        <input
          style={f.input}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        {showToggle && (
          <button style={f.eye} onClick={onToggle}>
            <img
              src={type === 'password' ? closeEye : openEye}
              alt="toggle password"
              style={{ width: '20px', height: '20px' }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#000' },
  inner:   { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, width: '600px' },
  logoWrap:{ marginBottom: '24px', textAlign: 'center' },
  logo:    { width: 'min(500px, 40vw)', height: 'auto' },
  card:    { background: '#FFD7B5', borderRadius: '20px', padding: '32px 40px', width: '100%' },
  btn:     { marginTop: '24px', width: '60%', padding: '16px', borderRadius: '30px', background: '#e85d00', color: '#fff', fontSize: '18px', fontWeight: '800', border: 'none', cursor: 'pointer', letterSpacing: '2px' },
  error:   { background: '#fce8e8', color: '#c0392b', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
};

const f: Record<string, React.CSSProperties> = {
  row:       { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
  label:     { fontSize: '16px', fontWeight: '700', color: '#1a0a00', width: '180px' },
  inputWrap: { position: 'relative', flex: 1 },
  input:     { width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', fontSize: '14px', background: '#fff', outline: 'none', boxSizing: 'border-box' },
  eye:       { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
};

export default Signup;