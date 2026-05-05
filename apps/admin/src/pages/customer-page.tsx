import { useNavigate } from 'react-router-dom'
import TempPage from './temp-page'
import type { Customer } from '../types'

const columns = [
    { key: 'code',  label: 'CODE'  },
    { key: 'name',  label: 'NAME'  },
    { key: 'phone', label: 'PHONE' },
    { key: 'email', label: 'EMAIL' },
]

interface CustomerPageProps {
    pic?: string
    username?: string
    data?: Customer[]
}

export default function CustomerPage({ pic, username, data = [] }: CustomerPageProps) {
    const navigate = useNavigate()

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Customer"
            columns={columns}
            data={data as unknown as Record<string, unknown>[]}
            onEdit={(row)   => navigate(`/customers/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new customer')}
        />
    )
}