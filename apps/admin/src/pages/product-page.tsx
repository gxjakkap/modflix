import { useNavigate } from 'react-router-dom'
import TempPage from './temp-page'
import type { Product } from '../types'

const columns = [
    { key: 'code',  label: 'CODE'  },
    { key: 'name',  label: 'NAME'  },
    { key: 'price', label: 'PRICE' },
    { key: 'type',  label: 'TYPE'  },
]

interface ProductPageProps {
    pic?: string
    username?: string
    data?: Product[]
}

export default function ProductPage({ pic, username, data = [] }: ProductPageProps) {
    const navigate = useNavigate()

    return (
        <TempPage
            pic={pic}
            username={username}
            title="Products"
            columns={columns}
            data={data as unknown as Record<string, unknown>[]}
            onEdit={(row)   => navigate(`/products/edit/${row.code}`)}
            onDelete={(row) => console.log('Delete', row)}
            onCreate={()    => console.log('Create new product')}
        />
    )
}