import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../navbar/Navbar.jsx'
import styles from './customeredit.module.css'

const COUNTRIES = ['Thailand', 'Korea', 'Japan', 'USA', 'UK', 'China', 'Singapore', 'Australia']

export default function CustomerEditPage({ pic, username, customers = [], onSave }) {
    const { code } = useParams()
    const navigate = useNavigate()
    const original = customers.find(c => c.code === code)

    const [draft, setDraft]   = useState(original ? { ...original } : null)
    const [errors, setErrors] = useState({})
    const [saved, setSaved]   = useState(false)

    if (!original) {
        return (
            <>
                <Navbar pic={pic} username={username} />
                <div className={styles.notFound}>
                    <p>Customer <strong>{code}</strong> not found.</p>
                    <button className={styles.backBtn} onClick={() => navigate('/customers')}>← Back</button>
                </div>
            </>
        )
    }

    const handleChange = (field, value) => {
        setErrors(prev => ({ ...prev, [field]: null }))
        setDraft(prev => ({ ...prev, [field]: value }))
    }

    const validate = () => {
        const e = {}
        if (!draft.name?.trim())  e.name  = 'Required'
        if (!draft.phone?.trim()) e.phone = 'Required'
        if (!draft.email?.trim() || !draft.email.includes('@')) e.email = 'Valid email required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSave = () => {
        if (!validate()) return
        onSave(draft)
        setSaved(true)
        setTimeout(() => navigate('/customers'), 800)
    }

    return (
        <>
            <Navbar pic={pic} username={username} />
            <h1 className={styles.pageTitle}>Edit Customers</h1>

            <div className={styles.pageWrapper}>
                <div className={styles.topSection}>

                    {/* ── Fields (left) ── */}
                    <div className={styles.fieldsSection}>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>CODE <span className={styles.req}>*</span></label>
                            <div className={styles.fieldValue}>{draft.code}</div>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>NAME <span className={styles.req}>*</span></label>
                            <div className={styles.inputWrap}>
                                <input
                                    className={`${styles.fieldInput} ${errors.name ? styles.inputErr : ''}`}
                                    value={draft.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                />
                                {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                            </div>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={`${styles.fieldLabel} ${styles.phoneLabel}`}>PHONE <span className={styles.req}>*</span></label>
                            <div className={styles.inputWrap}>
                                <input
                                    className={`${styles.fieldInput} ${errors.phone ? styles.inputErr : ''}`}
                                    value={draft.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                />
                                {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
                            </div>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>EMAIL <span className={styles.req}>*</span></label>
                            <div className={styles.inputWrap}>
                                <input
                                    className={`${styles.fieldInput} ${errors.email ? styles.inputErr : ''}`}
                                    value={draft.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                                {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
                            </div>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>COUNTRY</label>
                            <select
                                className={styles.fieldSelect}
                                value={draft.country || ''}
                                onChange={e => handleChange('country', e.target.value)}
                            >
                                <option value="">—</option>
                                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className={styles.fieldRow}>
                            <label className={styles.fieldLabel}>BOD</label>
                            <input
                                className={styles.fieldInput}
                                value={draft.dob || ''}
                                placeholder="DD/MM/YYYY"
                                onChange={e => handleChange('dob', e.target.value)}
                            />
                        </div>

                    </div>

                    {/* ── Image placeholder (right) ── */}
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.imageIcon}>
                            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                        </div>
                    </div>

                </div>

                {/* ── Bottom bar ── */}
                <div className={styles.bottomBar}>
                    <button className={styles.backBtn} onClick={() => navigate('/customers')}>← Back</button>
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