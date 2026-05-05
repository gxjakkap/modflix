import { useNavigate } from 'react-router-dom'
import TempPage from './temp-page'
import type { Cast } from '../types'

const columns = [
    { key: 'code',      label: 'CODE'       },
    { key: 'name',      label: 'NAME'       },
    { key: 'type',      label: 'TYPE'       },
    { key: 'totalCast', label: 'TOTAL CAST' },
]

interface CastPageProps {
    pic?: string
    username?: string
    data?: Cast[]
}

export default function CastPage({ pic, username, data = [] }: CastPageProps) {
    const navigate = useNavigate()
    const display  = data.map(c => ({ ...c, totalCast: c.cast?.length ?? 0 }))

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Cast"
            columns={columns}
            data={display as unknown as Record<string, unknown>[]}
            onEdit={(row)   => navigate(`/cast/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new cast')}
        />
    )
}