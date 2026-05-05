import { useState } from 'react'
import styles from './temppage.module.css'
import Navbar from '../navbar/Navbar.jsx'
import searchIcon from '../assets/search.png'

export default function TempPage({ 
    pic, 
    username = 'Guest', 
    title = 'Template', 
    columns = [],   // e.g. [{ key: 'code', label: 'CODE' }, ...]
    data = [],      // array of row objects
    onEdit,         // callback when Edit clicked
    onDelete,       // callback when Delete clicked
    onCreate,       // callback when Create New clicked
}) {
    const [search, setSearch] = useState('')
    const [sortKey, setSortKey] = useState(null)
    const [sortAsc, setSortAsc] = useState(true)

    const handleSort = (key) => {
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
            if (a[sortKey] < b[sortKey]) return sortAsc ? -1 : 1
            if (a[sortKey] > b[sortKey]) return sortAsc ? 1 : -1
            return 0
        })

    const arrow = (key) => sortKey === key ? (sortAsc ? ' ▲' : ' ▼') : ' ▲'

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
                                            {row[col.key]}
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