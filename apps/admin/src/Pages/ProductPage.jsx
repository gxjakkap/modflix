import { useNavigate } from 'react-router-dom'
import TempPage from './TempPage.jsx'

const columns = [
    { key: 'code',  label: 'CODE'  },
    { key: 'name',  label: 'NAME'  },
    { key: 'price', label: 'PRICE' },
    { key: 'type',  label: 'TYPE'  },
]

export default function ProductPage({ pic, username, data = [] }) {
    const navigate = useNavigate()

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Products"
            columns={columns}
            data={data}
            onEdit={(row)   => navigate(`/products/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new product')}
        />
    )
}