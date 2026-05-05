import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar'
import styles from './product-edit-page.module.css'
import type { Product, Episode } from '../../types'

const TYPES  = ['MOVIE', 'SERIES']
const GENRES = ['Action', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Sports', 'Comedy', 'Thriller']

interface ProductEditPageProps {
    pic?: string
    username?: string
    products?: Product[]
    onSave: (product: Product) => void
}

export default function ProductEditPage({ pic, username, products = [], onSave }: ProductEditPageProps) {
    const { code } = useParams<{ code: string }>()
    const navigate = useNavigate()
    const original = products.find(p => p.code === code)

    const [draft, setDraft]       = useState<Product | null>(original ? { ...original, episodes: [...(original.episodes || [])] } : null)
    const [errors, setErrors]     = useState<Record<string, string | null>>({})
    const [saved, setSaved]       = useState(false)

    // inline add-episode form
    const [showAddEp, setShowAddEp] = useState(false)
    const [newEp, setNewEp]         = useState({ name: '', price: '' })
    const [epErrors, setEpErrors]   = useState<Record<string, string | null>>({})

    // inline edit episode
    const [editingEpIdx, setEditingEpIdx] = useState<number | null>(null)
    const [editingEp, setEditingEp]       = useState<Partial<Episode>>({})

    if (!original || !draft) {
        return (
            <>
                <Navbar pic={pic} username={username} />
                <div className={styles.notFound}>
                    <p>Product <strong>{code}</strong> not found.</p>
                    <button className={styles.backBtn} onClick={() => navigate('/products')}>← Back</button>
                </div>
            </>
        )
    }

    // ── Field change ──
    const handleChange = (field: string, value: string) => {
        setErrors(prev => ({ ...prev, [field]: null }))
        setDraft(prev => prev ? ({ ...prev, [field]: value }) : prev)
    }

    // ── Validate main form ──
    const validate = () => {
        const e: Record<string, string> = {}
        if (!draft.name?.trim())  e.name  = 'Required'
        if (!draft.price?.trim() || isNaN(Number(draft.price))) e.price = 'Must be a number'
        if (!draft.type)          e.type  = 'Required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSave = () => {
        if (!validate()) return
        onSave({ ...draft, totalEpisodes: draft.episodes.length })
        setSaved(true)
        setTimeout(() => navigate('/products'), 800)
    }

    // ── Episode helpers ──
    const nextEpCode = () => {
        const n = draft.episodes.length + 1
        return `EP${String(n).padStart(2, '0')}`
    }

    const handleAddEp = () => {
        const e: Record<string, string> = {}
        if (!newEp.name.trim()) e.name = 'Required'
        if (!newEp.price.trim() || isNaN(Number(newEp.price))) e.price = 'Must be a number'
        if (Object.keys(e).length) { setEpErrors(e); return }
        setDraft(prev => prev ? ({
            ...prev,
            episodes: [...prev.episodes, { code: nextEpCode(), name: newEp.name.trim(), price: newEp.price.trim() }],
        }) : prev)
        setNewEp({ name: '', price: '' })
        setEpErrors({})
        setShowAddEp(false)
    }

    const handleDeleteEp = (idx: number) => {
        setDraft(prev => {
            if (!prev) return prev
            const updated = prev.episodes.filter((_, i) => i !== idx)
                .map((ep, i) => ({ ...ep, code: `EP${String(i + 1).padStart(2, '0')}` }))
            return { ...prev, episodes: updated }
        })
    }

    const startEditEp = (idx: number) => {
        setEditingEpIdx(idx)
        setEditingEp({ ...draft.episodes[idx] })
    }

    const saveEditEp = () => {
        setDraft(prev => {
            if (!prev || editingEpIdx === null) return prev
            const updated = [...prev.episodes]
            updated[editingEpIdx] = editingEp as Episode
            return { ...prev, episodes: updated }
        })
        setEditingEpIdx(null)
    }

    return (
        <>
            <Navbar pic={pic} username={username} />
            <h1 className={styles.pageTitle}>Edit Products</h1>

            <div className={styles.pageWrapper}>

                {/* ── Top section: image + fields ── */}
                <div className={styles.topSection}>

                    {/* Image placeholder */}
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.imageIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                    </div>

                    {/* Fields grid */}
                    <div className={styles.fieldsSection}>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>CODE <span className={styles.req}>*</span></label>
                            <div className={styles.fieldValue}>{draft.code}</div>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>NAME <span className={styles.req}>*</span></label>
                            <input
                                className={`${styles.fieldInput} ${errors.name ? styles.inputErr : ''}`}
                                value={draft.name}
                                onChange={e => handleChange('name', e.target.value)}
                            />
                            {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>TYPE <span className={styles.req}>*</span></label>
                            <select
                                className={`${styles.fieldSelect} ${errors.type ? styles.inputErr : ''}`}
                                value={draft.type}
                                onChange={e => handleChange('type', e.target.value)}
                            >
                                <option value="">—</option>
                                {TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                            {draft.type === 'SERIES' && (
                                <>
                                    <label className={styles.fieldLabel} style={{ marginLeft: '24px' }}>Total Episodes</label>
                                    <div className={styles.fieldValue}>{draft.episodes.length}</div>
                                </>
                            )}
                            {errors.type && <span className={styles.errMsg}>{errors.type}</span>}
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>PRICE <span className={styles.req}>*</span></label>
                            <input
                                className={`${styles.fieldInput} ${errors.price ? styles.inputErr : ''}`}
                                value={draft.price}
                                onChange={e => handleChange('price', e.target.value)}
                            />
                            {errors.price && <span className={styles.errMsg}>{errors.price}</span>}
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>GENRE <span className={styles.req}>*</span></label>
                            <select
                                className={styles.fieldSelect}
                                value={draft.genre || ''}
                                onChange={e => handleChange('genre', e.target.value)}
                            >
                                <option value="">—</option>
                                {GENRES.map(g => <option key={g}>{g}</option>)}
                            </select>
                        </div>

                    </div>
                </div>

                {/* ── Description ── */}
                <div className={styles.descSection}>
                    <label className={styles.descLabel}>Description</label>
                    <textarea
                        className={styles.descArea}
                        value={draft.description || ''}
                        onChange={e => handleChange('description', e.target.value)}
                        rows={4}
                    />
                </div>

                {/* ── Episode section (SERIES only) ── */}
                {draft.type === 'SERIES' && (
                    <div className={styles.episodeSection}>
                        <div className={styles.epHeader}>
                            <button className={styles.addEpBtn} onClick={() => { setShowAddEp(v => !v); setEpErrors({}) }}>
                                + ADD EPISODE
                            </button>
                        </div>

                        <div className={styles.epTableLabel}>Episode Detail</div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>CODE</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {draft.episodes.map((ep, idx) => (
                                        <tr key={ep.code}>
                                            <td className={styles.epCode}>{ep.code}</td>
                                            {editingEpIdx === idx ? (
                                                <>
                                                    <td><input className={styles.epInput} value={editingEp.name} onChange={e => setEditingEp(p => ({...p, name: e.target.value}))} /></td>
                                                    <td><input className={styles.epInput} value={editingEp.price} onChange={e => setEditingEp(p => ({...p, price: e.target.value}))} /></td>
                                                    <td className={styles.actionCell}>
                                                        <button className={styles.editBtn} onClick={saveEditEp}>Save</button>
                                                        <button className={styles.deleteBtn} onClick={() => setEditingEpIdx(null)}>Cancel</button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{ep.name}</td>
                                                    <td>{ep.price}</td>
                                                    <td className={styles.actionCell}>
                                                        <button className={styles.editBtn} onClick={() => startEditEp(idx)}>Edit</button>
                                                        <button className={styles.deleteBtn} onClick={() => handleDeleteEp(idx)}>Delete</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}

                                    {/* Inline add form */}
                                    {showAddEp && (
                                        <tr className={styles.addRow}>
                                            <td className={styles.epCode}>{nextEpCode()}</td>
                                            <td>
                                                <input
                                                    className={`${styles.epInput} ${epErrors.name ? styles.inputErr : ''}`}
                                                    placeholder="Episode name"
                                                    value={newEp.name}
                                                    onChange={e => { setEpErrors(p=>({...p,name:null})); setNewEp(p=>({...p,name:e.target.value})) }}
                                                />
                                                {epErrors.name && <div className={styles.errMsg}>{epErrors.name}</div>}
                                            </td>
                                            <td>
                                                <input
                                                    className={`${styles.epInput} ${epErrors.price ? styles.inputErr : ''}`}
                                                    placeholder="0.00"
                                                    value={newEp.price}
                                                    onChange={e => { setEpErrors(p=>({...p,price:null})); setNewEp(p=>({...p,price:e.target.value})) }}
                                                />
                                                {epErrors.price && <div className={styles.errMsg}>{epErrors.price}</div>}
                                            </td>
                                            <td className={styles.actionCell}>
                                                <button className={styles.editBtn} onClick={handleAddEp}>Add</button>
                                                <button className={styles.deleteBtn} onClick={() => { setShowAddEp(false); setEpErrors({}) }}>Cancel</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Bottom actions ── */}
                <div className={styles.bottomBar}>
                    <button className={styles.backBtn} onClick={() => navigate('/products')}>← Back</button>
                    <button
                        className={`${styles.saveBtn} ${saved ? styles.savedBtn : ''}`}
                        onClick={handleSave}
                        disabled={saved}
                    >
                        {saved ? '✓ SAVED!' : 'SAVE CHANGES'}
                    </button>
                </div>

            </div>
        </>
    )
}