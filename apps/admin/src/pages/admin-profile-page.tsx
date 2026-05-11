import type { ClientSideUser, UserWithRole } from "@modflix/auth/better-auth-client"
import AdminProfile from "../components/admin-profile"
import Navbar from "../components/navbar"

interface AdminProfilePageProps {
	user: ClientSideUser
	onSave: () => void
}

function AdminProfilePage({ user, onSave }: AdminProfilePageProps) {
	return (
		<>
			<Navbar pic={user.image || undefined} username={user.username || user.name} />
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "flex-start",
					padding: "2rem",
				}}
			></div>
			<AdminProfile user={user} onSave={onSave} />
		</>
	)
}

export default AdminProfilePage
