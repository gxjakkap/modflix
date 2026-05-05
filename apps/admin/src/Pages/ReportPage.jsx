import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar.jsx'

//หน้า Reportรับ filterContent 
export default function ReportPage({ pic, username, title, filterContent, onReset, columns, tableData, children }) {
    const navigate = useNavigate()

    return (
        <div>
            <Navbar pic={pic} username={username} />
            <h1 style={{ color: 'white', marginLeft: '200px', marginTop: '20px', fontSize: '40px' }}>{title}</h1>

            <div style={{ width: '90%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '60px' }}>

                {/* กล่อง Filter */}
                <div style={{ background: '#FFD7B5', borderRadius: '20px', padding: '28px 36px' }}>
                    {filterContent}
                    <hr style={{ margin: '20px 0', borderColor: '#ddd' }} />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button onClick={onReset} style={btnWhite}>RESET</button>
                        <button style={btnOrange}>Apply Filters</button>
                    </div>
                </div>

                {/* กล่องตาราง */}
                <div style={{ background: '#FFD7B5', borderRadius: '20px', padding: '28px 36px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <button style={{ background: 'transparent', color: '#e85d00', border: '2px solid #e85d00', borderRadius: '20px', padding: '6px 20px', fontSize: '14px', cursor: 'pointer', marginBottom: '12px' }}>
                            ↺ Refresh
                        </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '14px' }}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                                    {columns.map((col, j) => (
                                        <td key={col.key} style={{ padding: '12px 10px', color: j === 0 ? '#e85d00' : '#333', fontWeight: j === 0 ? '700' : 'normal', fontSize: '14px' }}>
                                            {row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ส่วน chart หรือ metric พิเศษ ใส่ผ่าน children */}
                    {children}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate(-1)} style={btnWhite}>← Back</button>
                    <button style={btnOrange}>Export</button>
                </div>

            </div>
        </div>
    )
}

const btnWhite  = { background: 'white', border: '2px solid #ccc', borderRadius: '20px', padding: '8px 24px', fontSize: '15px', cursor: 'pointer' }
const btnOrange = { background: '#e85d00', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 24px', fontSize: '15px', cursor: 'pointer' }