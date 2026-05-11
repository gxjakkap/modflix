import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Navbar from "../../components/navbar"
import { api } from "../../lib/api"
import styles from "./customer-edit-page.module.css"

interface CustomerEditPageProps {
	pic?: string
	username?: string
}

interface CustomerEdit {
	id: string
	name: string
	username: string
	email: string
}

export default function CustomerEditPage({ pic, username }: CustomerEditPageProps) {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [draft, setDraft] = useState<CustomerEdit | null>(null)
	const [errors, setErrors] = useState<Record<string, string | null>>({})
	const [saved, setSaved] = useState(false)
	const [saving, setSaving] = useState(false)

	if (!id) {
		return (
			<>
				<Navbar pic={pic} username={username} />
				<div className={styles.notFound}>
					<p>Missing id params.</p>
					<button className={styles.backBtn} onClick={() => navigate("/customers")}>
						← Back
					</button>
				</div>
			</>
		)
	}

	useEffect(() => {
		api.admin.customers
			.get({
				query: {
					id: id,
				},
			})
			.then((res) => {
				if (res.status !== 200 || !res.data) return
				setDraft(res.data)
			})
	}, [])

	if (!draft) {
		return (
			<>
				<Navbar pic={pic} username={username} />
				<div className={styles.notFound}>
					<p>
						Customer with id <strong>{id}</strong> not found.
					</p>
					<button className={styles.backBtn} onClick={() => navigate("/customers")}>
						← Back
					</button>
				</div>
			</>
		)
	}

	const handleChange = (field: string, value: string) => {
		setErrors((prev) => ({ ...prev, [field]: null }))
		setDraft((prev) => (prev ? { ...prev, [field]: value } : prev))
	}

	const validate = () => {
		const e: Record<string, string> = {}
		if (!draft.name?.trim()) e.name = "Required"
		if (!draft.username?.trim()) e.username = "Required"
		setErrors(e)
		return Object.keys(e).length === 0
	}

	const handleSave = () => {
		if (!validate()) return
		setSaving(true)
		api.admin.customers
			.patch({
				userId: draft.id,
				fullName: draft.name,
				username: draft.username,
			})
			.then((res) => {
				if (res.status === 200) {
					setSaving(false)
					setSaved(true)
					setTimeout(() => navigate("/customers"), 800)
				} else {
					setSaving(false)
					window.alert(`Error: [${res.error?.status}] ${res.error?.value}`)
				}
			})
	}

	return (
		<>
			<Navbar pic={pic} username={username} />
			<h1 className={styles.pageTitle}>Edit Customers</h1>

			<div className={styles.pageWrapper}>
				<div className={styles.topSection}>
					<div className={styles.fieldsSection}>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>ID/EMAIL</label>
							<div>
								{draft.id} / {draft.email}
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>
								USERNAME <span className={styles.req}>*</span>
							</label>
							<div className={styles.inputWrap}>
								<input
									className={`${styles.fieldInput} ${errors.username ? styles.inputErr : ""}`}
									value={draft.username}
									onChange={(e) => handleChange("username", e.target.value)}
								/>
								{errors.username && <span className={styles.errMsg}>{errors.username}</span>}
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>
								NAME <span className={styles.req}>*</span>
							</label>
							<div className={styles.inputWrap}>
								<input
									className={`${styles.fieldInput} ${errors.name ? styles.inputErr : ""}`}
									value={draft.name}
									onChange={(e) => handleChange("name", e.target.value)}
								/>
								{errors.name && <span className={styles.errMsg}>{errors.name}</span>}
							</div>
						</div>
					</div>
				</div>

				<div className={styles.bottomBar}>
					<button className={styles.backBtn} onClick={() => navigate("/customers")}>
						← Back
					</button>
					<button
						className={`${styles.saveBtn} ${saved ? styles.savedBtn : ""}`}
						onClick={handleSave}
						disabled={saved || saving}
					>
						{saved ? "✓ SAVED!" : saving ? "SAVING..." : "SAVE CHANGES"}
					</button>
				</div>
			</div>
		</>
	)
}
