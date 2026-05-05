interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'BY NAME, ID' }: SearchBarProps) {
  return (
    <div style={s.wrap}>
      <span style={s.icon}>&#128269;</span>
      <input
        style={s.input}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap:  { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1.5px solid #e0d0c0', borderRadius: '36px', padding: '18px 16px', width: '240px' },
  icon:  { fontSize: '16px', color: '#aaa' },
  input: { border: 'none', outline: 'none', fontSize: '18px', width: '100%', background: 'transparent', color: '#333' },
};
