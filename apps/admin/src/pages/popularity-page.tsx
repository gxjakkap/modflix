import { useState } from 'react'
import ReportPage from './report-page'

const columns = [
    { key: 'genre',    label: 'Genre'          },
    { key: 'views',    label: 'Views'          },
    { key: 'purchase', label: 'Total Purchase' },
]

const tableData = [
    { genre: 'Action',  views: 12500, purchase: 11000 },
    { genre: 'Drama',   views: 670,   purchase: 550   },
    { genre: 'Fantasy', views: 10020, purchase: 9999  },
    { genre: 'Sci-fi',  views: 2000,  purchase: 1579  },
]

interface ChartDataPoint {
    month: string
    action: number
    drama: number
    fantasy: number
    scifi: number
}

const chartData: ChartDataPoint[] = [
    { month: 'Jan', action: 5, drama: 1, fantasy: 4, scifi: 2 },
    { month: 'Feb', action: 4, drama: 2, fantasy: 3, scifi: 1 },
    { month: 'Mar', action: 6, drama: 1, fantasy: 5, scifi: 3 },
    { month: 'Apr', action: 7, drama: 2, fantasy: 6, scifi: 2 },
    { month: 'May', action: 5, drama: 3, fantasy: 4, scifi: 2 },
    { month: 'Jun', action: 6, drama: 1, fantasy: 7, scifi: 3 },
]

const sortKeyMap: Record<string, keyof typeof tableData[number]> = {
    'Genre': 'genre',
    'Views': 'views',
    'Total Purchase': 'purchase',
}

interface PopularityPageProps {
    pic?: string
    username?: string
}

export default function PopularityPage({ pic, username }: PopularityPageProps) {
    const [type, setType]     = useState('Movie')
    const [sortBy, setSortBy] = useState('Genre')
    const [from, setFrom]     = useState('')
    const [to, setTo]         = useState('')

    const sortKey = sortKeyMap[sortBy] ?? 'genre'
    const sorted  = [...tableData].sort((a, b) => a[sortKey] > b[sortKey] ? 1 : -1)

    return (
        <ReportPage
            pic={pic} username={username}
            title="Popularity Metrics"
            filterContent={
                <div>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={label}>Type</p>
                            <select value={type} onChange={e => setType(e.target.value)} style={sel}>
                                <option>Movie</option><option>Series</option>
                            </select>
                        </div>
                        <div>
                            <p style={label}>Date Range</p>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={inp} />
                                <span>to</span>
                                <input type="date" value={to}   onChange={e => setTo(e.target.value)}   style={inp} />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <p style={label}>Sort by</p>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={sel}>
                            <option>Genre</option><option>Views</option><option>Total Purchase</option>
                        </select>
                    </div>
                </div>
            }
            onReset={() => { setType('Movie'); setSortBy('Genre'); setFrom(''); setTo('') }}
            columns={columns}
            tableData={sorted}
        >
            {/* Bar Chart ใต้ตาราง */}
            <div style={{ background: 'white', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '120px' }}>
                    {chartData.map(d => (
                        <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', width: '100%', height: '100px' }}>
                                <div style={{ flex: 1, height: `${(d.action  / 7) * 100}%`, background: '#4472C4', borderRadius: '3px 3px 0 0' }} />
                                <div style={{ flex: 1, height: `${(d.drama   / 7) * 100}%`, background: '#ED7D31', borderRadius: '3px 3px 0 0' }} />
                                <div style={{ flex: 1, height: `${(d.fantasy / 7) * 100}%`, minHeight: '2px', background: '#70AD47', borderRadius: '3px 3px 0 0' }} />
                                <div style={{ flex: 1, height: `${(d.scifi   / 7) * 100}%`, background: '#FF4444', borderRadius: '3px 3px 0 0' }} />
                            </div>
                            <span style={{ fontSize: '11px', color: '#666' }}>{d.month}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px' }}>
                    {([['#4472C4','Action'],['#ED7D31','Drama'],['#70AD47','Fantasy'],['#FF4444','Sci-Fi']] as const).map(([c, name]) => (
                        <span key={name}>
                            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: c, marginRight: '4px', borderRadius: '2px' }} />
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </ReportPage>
    )
}

const label: React.CSSProperties = { fontWeight: '700', marginBottom: '6px' }
const sel: React.CSSProperties   = { padding: '10px 14px', borderRadius: '8px', border: 'none', minWidth: '180px', fontSize: '14px' }
const inp: React.CSSProperties   = { padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px' }