import { useNavigate } from 'react-router-dom'
import TempPage from './TempPage.jsx'

const columns = [
    { key: 'code',      label: 'CODE'       },
    { key: 'name',      label: 'NAME'       },
    { key: 'type',      label: 'TYPE'       },
    { key: 'totalCast', label: 'TOTAL CAST' },
]

export default function CastPage({ pic, username, data = [] }) {
    const navigate = useNavigate()
    const display  = data.map(c => ({ ...c, totalCast: c.cast?.length ?? 0 }))

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Cast"
            columns={columns}
            data={display}
            onEdit={(row)   => navigate(`/cast/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new cast')}
        />
    )
}