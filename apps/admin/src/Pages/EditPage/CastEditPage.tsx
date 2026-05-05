import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../navbar/Navbar.tsx'
import styles from './castedit.module.css'
import type { Cast, CastMember } from '../../types'

const ROLES = ['Actor', 'Director', 'Writer', 'Producer', 'Voice Actor', 'Cinematographer']
const TYPES = ['MOVIE', 'SERIES']

interface CastEditPageProps {
    pic?: string
    username?: string
    casts?: Cast[]
    onSave: (cast: Cast) => void
}

export default function CastEditPage({ pic, username, casts = [], onSave }: CastEditPageProps) {
    const { code } = useParams<{ code: string }>()
    const navigate = useNavigate()
    const original = casts.find(c => c.code === code)

    const [draft, setDraft]   = useState<Cast | null>(original ? { ...original, cast: [...(original.cast || [])] } : null)
    const [errors, setErrors] = useState<Record<string, string | null>>({})
    const [saved, setSaved]   = useState(false)

    const [showAdd, setShowAdd]       = useState(false)
    const [newMember, setNewMember]   = useState({ name: '', role: 'Actor' })
    const [addErrors, setAddErrors]   = useState<Record<string, string | null>>({})

    const [editingIdx, setEditingIdx]         = useState<number | null>(null)
    const [editingMember, setEditingMember]   = useState<Partial<CastMember>>({})

    if (!original || !draft) {
        return (
            <>
                <Navbar pic={pic} username={username} />
                <div className={styles.notFound}>
                    <p>Cast <strong>{code}</strong> not found.</p>
                    <button className={styles.backBtn} onClick={() => navigate('/cast')}>← Back</button>
                </div>
            </>
        )
    }

    const handleChange = (field: string, value: string) => {
        setErrors(prev => ({ ...prev, [field]: null }))
        setDraft(prev => prev ? ({ ...prev, [field]: value }) : prev)
    }

    const validate = () => {
        const e: Record<string, string> = {}
        if (!draft.name?.trim()) e.name = 'Required'
        if (!draft.type)         e.type = 'Required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSave = () => {
        if (!validate()) return
        onSave({ ...draft })
        setSaved(true)
        setTimeout(() => navigate('/cast'), 800)
    }

    const nextMemberCode = () => `EC${String(draft.cast.length + 1).padStart(2, '0')}`

    const handleAddMember = () => {
        const e: Record<string, string> = {}
        if (!newMember.name.trim()) e.name = 'Required'
        if (!newMember.role)        e.role = 'Required'
        if (Object.keys(e).length) { setAddErrors(e); return }
        setDraft(prev => prev ? ({
            ...prev,
            cast: [...prev.cast, { code: nextMemberCode(), name: newMember.name.trim(), role: newMember.role }]
        }) : prev)
        setNewMember({ name: '', role: 'Actor' })
        setAddErrors({})
        setShowAdd(false)
    }

    const handleDeleteMember = (idx: number) => {
        setDraft(prev => {
            if (!prev) return prev
            const updated = prev.cast
                .filter((_, i) => i !== idx)
                .map((m, i) => ({ ...m, code: `EC${String(i + 1).padStart(2, '0')}` }))
            return { ...prev, cast: updated }
        })
    }

    const startEdit = (idx: number) => {
        setEditingIdx(idx)
        setEditingMember({ ...draft.cast[idx] })
    }

    const saveEdit = () => {
        setDraft(prev => {
            if (!prev || editingIdx === null) return prev
            const updated = [...prev.cast]
            updated[editingIdx] = editingMember as CastMember
            return { ...prev, cast: updated }
        })
        setEditingIdx(null)
    }

    return (
        <>
            <Navbar pic={pic} username={username} />
            <h1 className={styles.pageTitle}>Edit Cast</h1>

            <div className={styles.pageWrapper}>

                {/* ── Top: image + fields ── */}
                <div className={styles.topSection}>

                    <div className={styles.imagePlaceholder}>
                        <div className={styles.imageIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                    </div>

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
                            {errors.type && <span className={styles.errMsg}>{errors.type}</span>}
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>Total Cast <span className={styles.req}>*</span></label>
                            <div className={styles.fieldValue}>{draft.cast.length}</div>
                        </div>

                    </div>
                </div>

                {/* ── Cast table ── */}
                <div className={styles.castSection}>

                    <div className={styles.castHeader}>
                        <button className={styles.addCastBtn} onClick={() => { setShowAdd(v => !v); setAddErrors({}) }}>
                            + ADD CAST
                        </button>
                    </div>

                    <div className={styles.castTableLabel}>Cast Detail</div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>CODE</th>
                                    <th>NAME</th>
                                    <th>Role</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {draft.cast.map((member, idx) => (
                                    <tr key={member.code}>
                                        <td className={styles.memberCode}>{member.code}</td>
                                        {editingIdx === idx ? (
                                            <>
                                                <td><input className={styles.tableInput} value={editingMember.name} onChange={e => setEditingMember(p => ({ ...p, name: e.target.value }))} /></td>
                                                <td>
                                                    <select className={styles.tableInput} value={editingMember.role} onChange={e => setEditingMember(p => ({ ...p, role: e.target.value }))}>
                                                        {ROLES.map(r => <option key={r}>{r}</option>)}
                                                    </select>
                                                </td>
                                                <td className={styles.actionCell}>
                                                    <button className={styles.editBtn} onClick={saveEdit}>Save</button>
                                                    <button className={styles.deleteBtn} onClick={() => setEditingIdx(null)}>Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{member.name}</td>
                                                <td><strong>{member.role}</strong></td>
                                                <td className={styles.actionCell}>
                                                    <button className={styles.editBtn} onClick={() => startEdit(idx)}>Edit</button>
                                                    <button className={styles.deleteBtn} onClick={() => handleDeleteMember(idx)}>Delete</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}

                                {showAdd && (
                                    <tr className={styles.addRow}>
                                        <td className={styles.memberCode}>{nextMemberCode()}</td>
                                        <td>
                                            <input
                                                className={`${styles.tableInput} ${addErrors.name ? styles.inputErr : ''}`}
                                                placeholder="Full name"
                                                value={newMember.name}
                                                onChange={e => { setAddErrors(p => ({ ...p, name: null })); setNewMember(p => ({ ...p, name: e.target.value })) }}
                                            />
                                            {addErrors.name && <div className={styles.errMsg}>{addErrors.name}</div>}
                                        </td>
                                        <td>
                                            <select
                                                className={`${styles.tableInput} ${addErrors.role ? styles.inputErr : ''}`}
                                                value={newMember.role}
                                                onChange={e => { setAddErrors(p => ({ ...p, role: null })); setNewMember(p => ({ ...p, role: e.target.value })) }}
                                            >
                                                {ROLES.map(r => <option key={r}>{r}</option>)}
                                            </select>
                                        </td>
                                        <td className={styles.actionCell}>
                                            <button className={styles.editBtn} onClick={handleAddMember}>Add</button>
                                            <button className={styles.deleteBtn} onClick={() => { setShowAdd(false); setAddErrors({}) }}>Cancel</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Bottom bar ── */}
                <div className={styles.bottomBar}>
                    <button className={styles.backBtn} onClick={() => navigate('/cast')}>← Back</button>
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