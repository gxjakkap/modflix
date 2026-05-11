import type { ClientSideUser } from "@modflix/auth/better-auth-client"
import { useState } from "react"
import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom"
import mockProfilePic from "../assets/rigbyMockProfilePic.png"
import type { AdminData } from "../types"
import AdminAccounts from "./admin-accounts"
import CreateAdmin from "./create-admin"
import LoginActivity from "./login-activity"
import Navbar from "./navbar"
import Sessions from "./Sessions"

interface ManagementDashboardProps {
	user: ClientSideUser
}

function ManagementDashboard({ user }: ManagementDashboardProps) {
	const [data, setData] = useState<AdminData[]>([])
	const navigate = useNavigate()

	const handleDelete = (id: string) => {
		setData((prev) => prev.filter((item) => item.id !== id))
	}

	const handleAddAdmin = (newAdmin: { fullname: string; email: string; role: string }) => {
		const nextId = String(data.length + 1).padStart(4, "0")
		const now = new Date()
		const dateStr = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`
		const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
		const timeStr = `${months[now.getMonth()]} ${now.getDate()}, ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

		setData((prev) => [
			...prev,
			{
				id: nextId,
				name: newAdmin.fullname.toUpperCase(),
				role: newAdmin.role || "ADMIN",
				login: dateStr,
				email: newAdmin.email,
				device: "Mac",
				ip: "192.168.1.1",
				last: "1 min ago",
				risk: "LOW" as const,
				time: timeStr,
				event: "LOGIN",
			},
		])
	}

	return (
		<>
			<Navbar pic={user.image || mockProfilePic} username={user.username || "username"} />
			<h1 style={{ color: "white", marginLeft: "9%", marginTop: "20px", fontSize: "40px", marginBottom: 45 }}>
				Management
			</h1>
			<div style={s.dash}>
				<div style={s.tabs}>
					<NavLink to="/management/admin" style={({ isActive }) => (isActive ? s.tabOn : s.tab)}>
						ADMIN ACCOUNTS
					</NavLink>
					<NavLink to="/management/sessions" style={({ isActive }) => (isActive ? s.tabOn : s.tab)}>
						SESSIONS
					</NavLink>
					<NavLink to="/management/login-activity" style={({ isActive }) => (isActive ? s.tabOn : s.tab)}>
						LOGIN ACTIVITY
					</NavLink>
				</div>
				<div style={s.card}>
					<Routes>
						<Route
							path="admin"
							element={
								<AdminAccounts onAddAdmin={() => navigate("/management/create-admin")} onDelete={handleDelete} />
							}
						/>
						<Route path="sessions" element={<Sessions data={data} onDelete={handleDelete} />} />
						<Route path="login-activity" element={<LoginActivity data={data} onDelete={handleDelete} />} />
						<Route
							path="create-admin"
							element={
								<CreateAdmin
									data={data}
									onAdd={(form) => {
										handleAddAdmin(form)
										navigate("/management/admin")
									}}
								/>
							}
						/>
						<Route path="*" element={<Navigate to="/management/admin" replace />} />
					</Routes>
				</div>
			</div>
		</>
	)
}

const s: Record<string, React.CSSProperties> = {
	dash: {
		background: "transparent",
		height: "100vh",
		fontFamily: "'Noto Sans Thai Looped', sans-serif",
		position: "relative",
		width: "90%",
		maxWidth: "1440px",
		marginLeft: "auto",
		marginRight: "auto",
		overflow: "hidden",
	},
	tabs: {
		display: "flex",
		gap: "9px",
		marginBottom: "0px",
		position: "relative",
		zIndex: 1,
	},
	tab: {
		flex: 1,
		padding: "20px",
		borderRadius: "8px 8px 0px 0px",
		fontSize: "20px",
		fontWeight: "700",
		border: "none",
		background: "#5a1a00",
		color: "#fff",
		letterSpacing: "0.5px",
		textAlign: "center",
		textDecoration: "none",
		display: "block",
	},
	tabOn: {
		flex: 1,
		padding: "20px",
		borderRadius: "8px 8px 0px 0px",
		fontSize: "20px",
		fontWeight: "700",
		border: "none",
		background: "#e85d00",
		color: "#fff",
		letterSpacing: "0.5px",
		textAlign: "center",
		textDecoration: "none",
		display: "block",
	},
	card: {
		background: "#FFD7B5",
		borderRadius: "0px 0px 50px 50px",
		minHeight: "550px",
		padding: "20px 3% 40px 3%",
		boxSizing: "border-box",
		position: "relative",
		zIndex: 1,
		overflow: "hidden",
	},
}

export default ManagementDashboard
