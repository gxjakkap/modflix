import React, { useState, useEffect, useRef } from 'react';

function Dropdown({ actions, onDelete }) {
  const [open, setOpen]   = useState(false);
  const [pos, setPos]     = useState({ top: 0, left: 0 });
  const btnRef            = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top:  rect.bottom + window.scrollY + 4,
        left: rect.right  + window.scrollX - 140,
      });
    }
    setOpen(o => !o);
  };

  const handleAction = (action) => {
    if (action.toLowerCase() === 'delete') {
      if (window.confirm('ยืนยันการลบข้อมูลนี้?')) {  // ✅ popup ยืนยันก่อนลบ
        if (typeof onDelete === 'function') {  // ✅ เช็คก่อนว่าเป็น function
          onDelete();
        }
      }
    }
    setOpen(false);
  };

  return (
    <div ref={btnRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button style={s.btn} onClick={handleClick}>
        ACTIONS ▼
      </button>

      {open && (
        <div
          style={{
            ...s.menu,
            position: 'fixed',
            top:  pos.top,
            left: pos.left,
          }}
        >
          {actions.map(action => (
            <div
              key={action}
              style={{
                ...s.item,
                color: ['delete','remove','block','suspend'].some(w =>
                  action.toLowerCase().includes(w)
                ) ? '#e24b4a' : '#333',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff0e8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => handleAction(action)}
            >
              {action}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

const s = {
  btn:  {
    background: '#e85d00',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '4px 8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  menu: {
    background: '#fff',
    border: '1px solid #e0d0c0',
    borderRadius: '8px',
    zIndex: 9999,
    minWidth: '150px',
    boxShadow: '0 4px 16px rgba(0,0,0,.2)',
    overflow: 'hidden',
  },
  item: {
    padding: '9px 14px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    background: 'transparent',
    transition: 'background .15s',
  },
};