import { useEffect, useState } from "react"
import "./admin-profile.css"
import type { ClientSideUser } from "@modflix/auth/better-auth-client"
import { api } from "../lib/api"

// Typing Rules (กรอง character ตอนพิมพ์)
const TYPING_RULES: Record<string, RegExp> = {
	fullName: /^[a-zA-Zก-๙\s]+$/, // รับเฉพาะตัวอักษร
}

// Save Rules (validate รูปแบบตอนกด Save)
const SAVE_RULES: Record<string, { pattern: RegExp; message: string }> = {
	fullName: {
		pattern: /^[a-zA-Zก-๙\s]+$/,
		message: "กรอกได้เฉพาะตัวอักษรเท่านั้น",
	},
	username: {
		pattern: /^.+$/,
		message: "กรุณากรอก Username",
	},
}

interface ProfileFormData {
	fullName: string
	username: string
}

interface FieldProps {
	label: string
	field: string
	full?: boolean
	editing: boolean
	value: string
	draft: string
	onChange: (field: string, value: string) => void
	error?: string | null
}

function Field({ label, field, full, editing, value, draft, onChange, error }: FieldProps) {
	return (
		<div className={`field-item${full ? " full" : ""}`}>
			<div className="field-label">{label}</div>
			{editing ? (
				<>
					<input
						className={`field-input${error ? " input-error" : ""}`}
						value={draft}
						onChange={(e) => onChange(field, e.target.value)}
					/>
					{error && <div className="field-error">{error}</div>}
				</>
			) : (
				<div className="field-value">{value}</div>
			)}
		</div>
	)
}

interface AdminProfileProps {
	user: ClientSideUser
	onSave: () => void
}

function AdminProfile({ user, onSave }: AdminProfileProps) {
	const [editing, setEditing] = useState(false)
	const [error] = useState<string | null>(null)
	const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({})
	const [form, setForm] = useState<ProfileFormData>({
		fullName: user.name || "",
		username: user.username || "username",
	})
	const [draft, setDraft] = useState<ProfileFormData>({ ...form })

	useEffect(() => {
		const newForm = {
			fullName: user.name || "",
			username: user.username || "username",
		}
		setForm(newForm)
		setDraft(newForm)
	}, [user])
	const [saving, setSaving] = useState(false)

	const handleEdit = () => {
		setDraft({ ...form })
		setFieldErrors({})
		setEditing(true)
	}

	const handleCancel = () => {
		setFieldErrors({})
		setEditing(false)
	}

	// กรอง character ตอนพิมพ์
	const handleChange = (field: string, value: string) => {
		const typingPattern = TYPING_RULES[field]
		if (typingPattern && value !== "") {
			if (!typingPattern.test(value)) return // บล็อก character ที่ไม่อนุญาต
		}
		setFieldErrors((prev) => ({ ...prev, [field]: null }))
		setDraft((prev) => ({ ...prev, [field]: value }))
	}

	// Validate รูปแบบตอนกด Save
	const validate = () => {
		const errors: Record<string, string> = {}
		Object.entries(SAVE_RULES).forEach(([field, rule]) => {
			if (!rule) return
			if (!rule.pattern.test(draft[field as keyof ProfileFormData] || "")) {
				errors[field] = rule.message
			}
		})
		setFieldErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleSave = async () => {
		if (!validate()) return
		setSaving(true)
		const res = await api.admin.manage["update-profile"].patch({
			...draft,
			userId: user.id,
		})
		setSaving(false)

		if (res.status === 200) {
			setForm({ ...draft })
			setEditing(false)
			onSave()
		} else {
			window.alert(`Error: [${res.status}] ${res.data?.message || "Unknown error"}`)
		}
	}

	const fields: Array<{ label: string; field: string; full?: boolean }> = [
		{ label: "FULL NAME", field: "fullName" },
		{ label: "USERNAME", field: "username" },
	]

	if (error) return <div className="admin-status error">Error: {error}</div>

	return (
		<div className="admin-wrapper">
			{/* Header */}
			<div className="admin-header">
				<h1>Super Admin</h1>
			</div>

			{/* Body */}
			<div className="admin-body">
				{/* Avatar Row */}
				<div className="admin-avatar-row">
					<div className="admin-avatar-info">
						<div className="admin-avatar">
							{/* Replace the letter with <img src="..." alt="avatar" /> for a real photo */}
							{
								user.image ? <img src={user.image} alt="avatar" /> : form.username[0] // ถ้าไม่มีรูปให้แสดงตัวอักษรแรก
							}
						</div>
						<div>
							<div className="admin-name">{form.username}</div>
							<div className="admin-userid">USER ID: {user.id}</div>
						</div>
					</div>

					<div className="btn-group">
						{editing ? (
							<>
								<button className="btn-cancel" onClick={handleCancel}>
									Cancel
								</button>
								<button className="btn-save" onClick={handleSave}>
									Save Changes
								</button>
							</>
						) : (
							<button className="btn-edit" onClick={handleEdit} disabled={saving}>
								{saving ? "Saving..." : "EDIT"}
							</button>
						)}
					</div>
				</div>

				{/* Fields */}
				<div className="admin-fields">
					{fields.map(({ label, field, full }) => (
						<Field
							key={field}
							label={label}
							field={field}
							full={full}
							editing={editing}
							value={form[field as keyof ProfileFormData]}
							draft={draft[field as keyof ProfileFormData]}
							onChange={handleChange}
							error={fieldErrors[field]}
						/>
					))}
					<Field
						label="EMAIL"
						field="email"
						full={true}
						editing={false}
						value={user.email}
						draft={user.email}
						onChange={() => {
							return
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default AdminProfile
