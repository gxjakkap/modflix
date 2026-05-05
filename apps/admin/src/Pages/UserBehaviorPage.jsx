import { useState } from 'react'
import ReportPage from './ReportPage.jsx'

const columns = [
    { key: 'segment',    label: 'Users Segment'   },
    { key: 'views',      label: 'Views'           },
    { key: 'avgWatch',   label: 'Avg Watch Time'  },
    { key: 'completion', label: 'Completion Rate' },
    { key: 'dropoff',    label: 'Drop-off Rate'   },
]

const tableData = [
    { segment: 'New Users',       views: '12,500', avgWatch: '18m 20s',    completion: '42%', dropoff: '33%' },
    { segment: 'Returning Users', views: '670',    avgWatch: '20m 12s',    completion: '60%', dropoff: '57%' },
    { segment: 'Premium Users',   views: '10,020', avgWatch: '2h 39m 20s', completion: '32%', dropoff: '47%' },
    { segment: 'Free Users',      views: '2,000',  avgWatch: '55m 20s',    completion: '72%', dropoff: '22%' },
]

const metrics = [
    { label: 'Total Users',           value: '420',  sub: '1.2% up from yesterday',             bars: [1200,1210,1205,1215,1220,1218,1230,1250], bg: '#dde3f0', color: '#7090c0' },
    { label: 'Active Users',          value: '213',  sub: '0.7% up from yesterday',             bars: [300,310,290,320,315,310,325,310],          bg: '#fff0e0', color: '#e85d00' },
    { label: 'Avg Watch Time',        value: '25',   sub: 'mins / session\n2.3% up from yesterday', bars: [24,24.5,24,25,24.8,25.2,25,26],       bg: '#e8e8f0', color: '#8888cc' },
    { label: 'Avg Sessions Duration', value: '40',   sub: 'mins\n0.7% down from yesterday',     bars: [12,12.5,12.2,12.8,13,13.2,13,13.5],       bg: '#e0f0e0', color: '#44aa44' },
    { label: 'Drop-off Rate',         value: '51%',  sub: '0.1% up from yesterday',             bars: [50,48,50,49,47,46,45,44],                  bg: '#f5e0e0', color: '#cc3333' },
]

export default function UserBehaviorPage({ pic, username }) {
    const [userType, setUserType] = useState('ALL')
    const [duration, setDuration] = useState('0 - 30 min')
    const [category, setCategory] = useState('Drama')
    const [dateRange, setDateRange] = useState('Last 7 Days')

    return (
        <ReportPage
            pic={pic} username={username}
            title="User Behavior"
            filterContent={
                <div>
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        <Sel label="User Type"        value={userType}  onChange={setUserType}  opts={['ALL','New','Returning','Premium','Free']} />
                        <Sel label="Watch Duration"   value={duration}  onChange={setDuration}  opts={['0 - 30 min','30 - 60 min','1h+']} />
                        <Sel label="Content Category" value={category}  onChange={setCategory}  opts={['Drama','Action','Fantasy','Sci-fi']} />
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <Sel label="Date Range" value={dateRange} onChange={setDateRange} opts={['Last 7 Days','Last 30 Days','Last 3 Months']} />
                    </div>
                </div>
            }
            onReset={() => { setUserType('ALL'); setDuration('0 - 30 min'); setCategory('Drama'); setDateRange('Last 7 Days') }}
            columns={columns}
            tableData={tableData}
        >
            {/* Metric Cards ใต้ตาราง */}
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {metrics.map((m, i) => {
                    const max = Math.max(...m.bars)
                    const min = Math.min(...m.bars)
                    return (
                        <div key={m.label} style={{ display: 'flex', gap: '24px', alignItems: 'center', borderBottom: i < metrics.length - 1 ? '1px solid #ddd' : 'none', paddingBottom: '24px' }}>
                            <div style={{ minWidth: '180px' }}>
                                <p style={{ fontWeight: '700', fontSize: '16px', margin: '0 0 4px' }}>{m.label}</p>
                                <p style={{ fontSize: '40px', fontWeight: '800', color: '#e85d00', margin: '0' }}>{m.value}</p>
                                <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0', whiteSpace: 'pre-line' }}>{m.sub}</p>
                            </div>
                            <div style={{ flex: 1, background: m.bg, borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
                                {m.bars.map((v, j) => (
                                    <div key={j} style={{ flex: 1, height: `${((v - min) / (max - min)) * 100}%`, minHeight: '4px', background: m.color, borderRadius: '3px 3px 0 0' }} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </ReportPage>
    )
}

function Sel({ label, value, onChange, opts }) {
    return (
        <div>
            <p style={{ fontWeight: '700', marginBottom: '6px' }}>{label}</p>
            <select value={value} onChange={e => onChange(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', minWidth: '150px', fontSize: '14px' }}>
                {opts.map(o => <option key={o}>{o}</option>)}
            </select>
        </div>
    )
}