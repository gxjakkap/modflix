import { useState } from 'react'
import styles from './temppage.module.css'
import Navbar from '../navbar/Navbar.tsx'
import searchIcon from '../assets/search.png'
import type { Column } from '../types'

interface TempPageProps {
    pic?: string
    username?: string
    title?: string
    columns?: Column[]
    data?: Record<string, unknown>[]
    onEdit?: (row: Record<string, unknown>) => void
    onDelete?: (row: Record<string, unknown>) => void
    onCreate?: () => void
}

export default function TempPage({ 
    pic, 
    username = 'Guest', 
    title = 'Template', 
    columns = [],
    data = [],
    onEdit,
    onDelete,
    onCreate,
}: TempPageProps) {
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key: string) => {
        if (sortKey === key) setSortAsc(!sortAsc)
        else { setSortKey(key); setSortAsc(true) }
    }

    const filtered = data
        .filter(row =>
            columns.some(col =>
                String(row[col.key]).toLowerCase().includes(search.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (!sortKey) return 0
            const aVal = a[sortKey]
            const bVal = b[sortKey]
            if (aVal == null || bVal == null) return 0
            if (aVal < bVal) return sortAsc ? -1 : 1
            if (aVal > bVal) return sortAsc ? 1 : -1
            return 0
        })

    const arrow = (key: string) => sortKey === key ? (sortAsc ? ' ▲' : ' ▼') : ' ▲'

    return (
        <>
            <Navbar pic={pic} username={username} />
            <h1 className={styles.titleText}>{title}</h1>
            <div className={styles.reportContainer}>


                <div className={styles.topbar}>
                    <div className={styles.searchBox}>
                        <img src={searchIcon} className={styles.searchIcon} />
                        <input
                            type="search"
                            placeholder="BY NAME, ID"
                            className={styles.searchbar}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button className={styles.createBtn} onClick={onCreate}>
                        + CREATE NEW
                    </button>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {columns.map(col => (
                                    <th key={col.key} onClick={() => handleSort(col.key)}>
                                        {col.label}{arrow(col.key)}
                                    </th>
                                ))}
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, i) => (
                                <tr key={i}>
                                    {columns.map((col, j) => (
                                        <td
                                            key={col.key}
                                            className={j === 0 ? styles.codeCell : ''}
                                        >
                                            {String(row[col.key])}
                                        </td>
                                    ))}
                                    <td className={styles.actionCell}>
                                        <button className={styles.editBtn}   onClick={() => onEdit?.(row)}>Edit</button>
                                        <button className={styles.deleteBtn} onClick={() => onDelete?.(row)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}