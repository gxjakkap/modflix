import React from 'react';

function Pagination({ current, total, onChange }) {
  return (
    <div style={s.wrap}>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          style={current === n ? s.on : s.btn}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default Pagination;

const s = {
  wrap: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '3px', 
    marginTop: '10px',
    background: 'white',        // ✅ พื้นหลังขาว
    border: '2px solid #000',   // ✅ เส้นขอบดำ
    borderRadius: '12px',       // ✅ มุมโค้ง
    padding: '4px 8px',         // ✅ padding รอบๆ
    width: 'fit-content',       // ✅ กว้างแค่พอดีเนื้อหา
    marginLeft: 'auto',         // ✅ ชิดขวา
  },
  btn: { 
    width: '26px', 
    height: '26px', 
    borderRadius: '8px',        // ✅ มุมโค้ง
    border: 'none', 
    background: 'transparent',
    cursor: 'pointer', 
    fontSize: '12px', 
    color: '#333',
    fontWeight: '600',
  },
  on: { 
    width: '26px', 
    height: '26px', 
    borderRadius: '8px',        // ✅ มุมโค้ง
    border: 'none', 
    background: '#e85d00',      // ✅ สีส้ม
    color: '#fff', 
    cursor: 'pointer', 
    fontSize: '12px',
    fontWeight: '600',
    border: '2px solid #000'
  },
};