interface PaginationProps {
    current: number
    total: number
    onChange: (page: number) => void
}

function Pagination({ current, total, onChange }: PaginationProps) {
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

const s: Record<string, React.CSSProperties> = {
  wrap: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '3px', 
    marginTop: '10px',
    background: 'white',
    border: '2px solid #000',
    borderRadius: '12px',
    padding: '4px 8px',
    width: 'fit-content',
    marginLeft: 'auto',
  },
  btn: { 
    width: '26px', 
    height: '26px', 
    borderRadius: '8px',
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
    borderRadius: '8px',
    border: '2px solid #000', 
    background: '#e85d00',
    color: '#fff', 
    cursor: 'pointer', 
    fontSize: '12px',
    fontWeight: '600',
  },
};