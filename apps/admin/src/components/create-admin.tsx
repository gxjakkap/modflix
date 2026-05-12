import { useState } from "react"
import closeEye from "../assets/closepassword.png"
import openEye from "../assets/openpassword.png"
import { api } from "../lib/api"
import type { AdminData } from "../types"

interface CreateAdminProps {
	onAddSuccess: () => void
}

function CreateAdmin({ onAddSuccess }: CreateAdminProps) {
	const [form, setForm] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
		confirmPassword: "",
		role: "",
	})
	const [showPass, setShowPass] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [error, setError] = useState("")

	const handleChange = (field: string, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = () => {
		if (!form.email || !form.username || !form.fullname || !form.password || !form.role) {
			setError("กรุณากรอกข้อมูลให้ครบทุกช่อง")
			return
		}
		if (form.password !== form.confirmPassword) {
			setError("Password ไม่ตรงกัน")
			return
		}
		if (form.role !== "admin" && form.role !== "super_admin") {
			setError("Role ไม่ถูกต้อง")
			return
		}

		api.admin.manage.admin
			.post({
				email: form.email,
				username: form.username,
				fullName: form.fullname,
				password: form.password,
				role: form.role,
			})
			.then((res) => {
				if (res.status !== 200) {
					setError(res.error?.value.message || "เกิดข้อผิดพลาด!")
				}
				setForm({
					email: "",
					username: "",
					fullname: "",
					password: "",
					confirmPassword: "",
					role: "",
				})
				setError("")
				onAddSuccess()
			})
	}

	return (
		<div>
			<div style={s.toolbar}>
				<button style={s.headerBtn}>CREATE ADMIN</button>
			</div>

			<div style={s.body}>
				{error && <div style={s.error}>{error}</div>}

				<div style={s.grid}>
					<Field label="Email" value={form.email} onChange={(v) => handleChange("email", v)} type="email" />
					<Field label="Username" value={form.username} onChange={(v) => handleChange("username", v)} />
					<Field label="Full Name" value={form.fullname} onChange={(v) => handleChange("fullname", v)} />
					<Field
						label="Password"
						value={form.password}
						onChange={(v) => handleChange("password", v)}
						type={showPass ? "text" : "password"}
						showToggle
						onToggle={() => setShowPass((p) => !p)}
					/>
					<Field
						label="Confirm Password"
						value={form.confirmPassword}
						onChange={(v) => handleChange("confirmPassword", v)}
						type={showConfirm ? "text" : "password"}
						showToggle
						onToggle={() => setShowConfirm((p) => !p)}
					/>
					<div style={s.fieldWrap}>
						<label style={s.label}>
							ROLE <span style={{ color: "#e85d00" }}>*</span>
						</label>
						<select style={s.select} value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
							<option value="">เลือก role</option>
							<option value="super_admin">SUPER ADMIN</option>
							<option value="admin">ADMIN</option>
						</select>
					</div>
				</div>

				<div style={{ textAlign: "right", marginTop: "16px" }}>
					<button style={s.addBtn} onClick={handleSubmit}>
						ADD
					</button>
				</div>
			</div>
		</div>
	)
}

interface FieldProps {
	label: string
	value: string
	onChange: (v: string) => void
	type?: string
	showToggle?: boolean
	onToggle?: () => void
}

function Field({ label, value = "", onChange, type = "text", showToggle, onToggle }: FieldProps) {
	return (
		<div style={f.wrap}>
			<label style={f.label}>
				{label} <span style={{ color: "#e85d00" }}>*</span>
			</label>
			<div style={f.inputWrap}>
				<input style={f.input} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
				{showToggle && (
					<button style={f.eye} onClick={onToggle}>
						<img
							src={type === "password" ? closeEye : openEye}
							alt="toggle"
							style={{ width: "20px", height: "20px" }}
						/>
					</button>
				)}
			</div>
		</div>
	)
}

export default CreateAdmin

const s: Record<string, React.CSSProperties> = {
	toolbar: { marginBottom: "20px", marginTop: "20px" },
	headerBtn: {
		background: "#e85d00",
		color: "#fff",
		border: "none",
		borderRadius: "20px",
		padding: "10px 24px",
		fontSize: "22px",
		fontWeight: "700",
		cursor: "pointer",
	},
	body: { padding: "8px" },
	userId: {
		fontSize: "20px",
		fontWeight: "700",
		color: "#333",
		marginBottom: "20px",
	},
	grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" },
	fieldWrap: { display: "flex", flexDirection: "column", gap: "4px" },
	label: { fontSize: "18px", fontWeight: "700", color: "#333" },
	select: {
		padding: "8px 12px",
		borderRadius: "8px",
		border: "1px solid #ccc",
		fontSize: "18px",
		background: "#fff",
		outline: "none",
	},
	error: { color: "#c0392b", fontSize: "13px", marginBottom: "12px" },
	addBtn: {
		background: "#e85d00",
		color: "#fff",
		border: "none",
		borderRadius: "20px",
		padding: "10px 40px",
		fontSize: "20px",
		fontWeight: "700",
		cursor: "pointer",
	},
}

const f: Record<string, React.CSSProperties> = {
	wrap: { display: "flex", flexDirection: "column", gap: "4px" },
	label: { fontSize: "18px", fontWeight: "700", color: "#333" },
	inputWrap: { position: "relative" },
	input: {
		width: "100%",
		padding: "8px 12px",
		borderRadius: "8px",
		border: "1px solid #ccc",
		fontSize: "16px",
		background: "#fff",
		outline: "none",
		boxSizing: "border-box",
	},
	eye: {
		position: "absolute",
		right: "8px",
		top: "50%",
		transform: "translateY(-50%)",
		background: "none",
		border: "none",
		cursor: "pointer",
	},
}
