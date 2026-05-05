import { useNavigate } from 'react-router-dom'
import TempPage from './TempPage.jsx'

const columns = [
    { key: 'code',  label: 'CODE'  },
    { key: 'name',  label: 'NAME'  },
    { key: 'phone', label: 'PHONE' },
    { key: 'email', label: 'EMAIL' },
]

export default function CustomerPage({ pic, username, data = [] }) {
    const navigate = useNavigate()

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Customer"
            columns={columns}
            data={data}
            onEdit={(row)   => navigate(`/customers/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new customer')}
        />
    )
}