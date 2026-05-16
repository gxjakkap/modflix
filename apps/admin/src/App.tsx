import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import type { ClientSideUser } from "@modflix/auth/better-auth-client"
import { AdminRolesEnum } from "@modflix/auth/roles"
import mockProfilePic from "./assets/rigbyMockProfilePic.png"
import Background from "./components/background.tsx"
import ManagementDashboard from "./components/management-dashboard.tsx"
import { authClient } from "./lib/auth-client.ts"
import AdminProfilePage from "./pages/admin-profile-page.tsx"
import CastPage from "./pages/cast-page.tsx"
import CastCreatePage from "./pages/create-page/cast-create-page.tsx"
import GenreCreatePage from "./pages/create-page/genre-create-page.tsx"
import ProductCreatePage from "./pages/create-page/product-create-page.tsx"
import CustomerPage from "./pages/customer-page.tsx"
import CastEditPage from "./pages/edit-page/cast-edit-page.tsx"
import CustomerEditPage from "./pages/edit-page/customer-edit-page.tsx"
import GenreEditPage from "./pages/edit-page/genre-edit-page.tsx"
import ProductEditPage from "./pages/edit-page/product-edit-page.tsx"
import GenrePage from "./pages/genre-page.tsx"
import LandingPage from "./pages/landing-page.tsx"
import LoginCredentialsPage from "./pages/login-credentials-page.tsx"
import LoginPage from "./pages/login-page.tsx"
import PopularityPage from "./pages/popularity-page.tsx"
import ProductPage from "./pages/product-page.tsx"
import SalesReportPage from "./pages/sales-report-page.tsx"
import UserBehaviorPage from "./pages/user-behavior-page.tsx"
import type { Episode, Product } from "./types"

function App() {
	const { data: session, isPending, refetch } = authClient.useSession()

	const [user, setUser] = useState<ClientSideUser | null>(null)

	useEffect(() => {
		if (isPending) return
		if (!session?.user) {
			setUser(null)
			return
		}
		const isAdmin = AdminRolesEnum.safeParse(session.user.role).success
		if (!isAdmin) {
			setUser(null)
			return
		}
		setUser(session.user as ClientSideUser)
	}, [isPending, session])

	useEffect(() => {
		document.body.style.overflow = user ? "" : "hidden"
	}, [user])

	const commonProps = {
		user,
		isLoggedIn: !!user,
		username: user?.username || "",
		pic: user?.image || mockProfilePic,
	}

	if (isPending) {
		return (
			<BrowserRouter>
				<Background />
			</BrowserRouter>
		)
	}

	return (
		<BrowserRouter>
			<Background />
			<Routes>
				<Route
					path="/reports/users"
					element={user ? <UserBehaviorPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/reports/popularity"
					element={user ? <PopularityPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/reports/sales"
					element={
						user ? (
							<SalesReportPage pic={commonProps.pic} username={commonProps.username} />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				{/* edit */}
				<Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={() => undefined} />} />

				<Route
					path="/login/credentials"
					element={user ? <Navigate to="/" replace /> : <LoginCredentialsPage onLogin={refetch} />}
				/>
				<Route path="/" element={user ? <LandingPage {...commonProps} /> : <Navigate to="/login" replace />} />

				<Route path="/products" element={user ? <ProductPage {...commonProps} /> : <Navigate to="/login" replace />} />
				<Route
					path="/products/create"
					element={user ? <ProductCreatePage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/products/edit/:code"
					element={user ? <ProductEditPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>

				<Route path="/people" element={user ? <CastPage {...commonProps} /> : <Navigate to="/login" replace />} />
				<Route
					path="/people/create"
					element={user ? <CastCreatePage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/people/edit/:id"
					element={user ? <CastEditPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>

				<Route
					path="/admin-profile"
					element={user ? <AdminProfilePage user={user} onSave={() => refetch()} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/customers"
					element={user ? <CustomerPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/customers/edit/:id"
					element={user ? <CustomerEditPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route path="/genres" element={user ? <GenrePage {...commonProps} /> : <Navigate to="/login" replace />} />
				<Route
					path="/genres/create"
					element={user ? <GenreCreatePage {...commonProps} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/genres/edit/:id"
					element={user ? <GenreEditPage {...commonProps} /> : <Navigate to="/login" replace />}
				/>

				<Route
					path="/management/*"
					element={user ? <ManagementDashboard user={user} /> : <Navigate to="/login" replace />}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
