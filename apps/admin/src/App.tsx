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
import CustomerPage from "./pages/customer-page.tsx"
import CastEditPage from "./pages/edit-page/cast-edit-page.tsx"
import CustomerEditPage from "./pages/edit-page/customer-edit-page.tsx"
import ProductEditPage from "./pages/edit-page/product-edit-page.tsx"
import LandingPage from "./pages/landing-page.tsx"
import LoginCredentialsPage from "./pages/login-credentials-page.tsx"
import LoginPage from "./pages/login-page.tsx"
import PopularityPage from "./pages/popularity-page.tsx"
import ProductPage from "./pages/product-page.tsx"
import SalesReportPage from "./pages/sales-report-page.tsx"
import UserBehaviorPage from "./pages/user-behavior-page.tsx"
import type { Cast, CastMember, Episode, Product } from "./types"

const mkEps = (count: number, price: string): Episode[] =>
	Array.from({ length: count }, (_, i) => ({
		code: `EP${String(i + 1).padStart(2, "0")}`,
		name: `Episode ${i + 1}`,
		price,
	}))

const mkCast = (members: Array<{ name: string; role: string }>): CastMember[] =>
	members.map((m, i) => ({ code: `EC${String(i + 1).padStart(2, "0")}`, ...m }))

const INITIAL_PRODUCTS: Product[] = [
	{
		code: "P01",
		name: "Avatar 1",
		price: "200.00",
		type: "MOVIE",
		genre: "Sci-Fi",
		description: "",
		totalEpisodes: 0,
		episodes: [],
	},
	{
		code: "P02",
		name: "Avatar 2",
		price: "200.00",
		type: "MOVIE",
		genre: "Sci-Fi",
		description: "",
		totalEpisodes: 0,
		episodes: [],
	},
	{
		code: "P03",
		name: "Avatar 3",
		price: "200.00",
		type: "MOVIE",
		genre: "Sci-Fi",
		description: "",
		totalEpisodes: 0,
		episodes: [],
	},
	{
		code: "P04",
		name: "Star War",
		price: "150.00",
		type: "MOVIE",
		genre: "Sci-Fi",
		description: "",
		totalEpisodes: 0,
		episodes: [],
	},
	{
		code: "P05",
		name: "Your name",
		price: "150.00",
		type: "MOVIE",
		genre: "Romance",
		description: "",
		totalEpisodes: 0,
		episodes: [],
	},
	{
		code: "P06",
		name: "Stranger Things ss1",
		price: "300.00",
		type: "SERIES",
		genre: "Horror",
		description: "A group of kids uncover a supernatural mystery in their small town.",
		totalEpisodes: 8,
		episodes: mkEps(8, "37.50"),
	},
	{
		code: "P07",
		name: "Itaewon Class",
		price: "450.00",
		type: "SERIES",
		genre: "Drama",
		description:
			"In a colorful Seoul neighborhood, an ex-con and his friends fight to make their street bar a reality.",
		totalEpisodes: 16,
		episodes: mkEps(16, "28.125"),
	},
	{
		code: "P08",
		name: "One piece",
		price: "450.00",
		type: "SERIES",
		genre: "Action",
		description: "A young pirate sets sail to find the legendary treasure called the One Piece.",
		totalEpisodes: 12,
		episodes: mkEps(12, "37.50"),
	},
	{
		code: "P09",
		name: "Blue Lock",
		price: "200.00",
		type: "SERIES",
		genre: "Sports",
		description: "Three hundred strikers compete to become Japan's best striker.",
		totalEpisodes: 10,
		episodes: mkEps(10, "20.00"),
	},
]

const INITIAL_CASTS: Cast[] = [
	{
		code: "CA01",
		name: "Avatar 1",
		type: "MOVIE",
		cast: mkCast([
			{ name: "Sam Worthington", role: "Actor" },
			{ name: "Zoe Saldana", role: "Actor" },
			{ name: "Sigourney Weaver", role: "Actor" },
		]),
	},
	{
		code: "CA02",
		name: "Avatar 2",
		type: "MOVIE",
		cast: mkCast([
			{ name: "Sam Worthington", role: "Actor" },
			{ name: "Zoe Saldana", role: "Actor" },
			{ name: "Kate Winslet", role: "Actor" },
		]),
	},
	{
		code: "CA03",
		name: "Avatar 3",
		type: "MOVIE",
		cast: mkCast([
			{ name: "Sam Worthington", role: "Actor" },
			{ name: "Zoe Saldana", role: "Actor" },
		]),
	},
	{
		code: "CA04",
		name: "Star War",
		type: "MOVIE",
		cast: mkCast([
			{ name: "Mark Hamill", role: "Actor" },
			{ name: "Harrison Ford", role: "Actor" },
			{ name: "Carrie Fisher", role: "Actor" },
		]),
	},
	{
		code: "CA05",
		name: "Your name",
		type: "MOVIE",
		cast: mkCast([
			{ name: "Ryunosuke Kamiki", role: "Voice Actor" },
			{ name: "Mone Kamishiraishi", role: "Voice Actor" },
		]),
	},
	{
		code: "CA06",
		name: "Stranger Things ss1",
		type: "SERIES",
		cast: mkCast([
			{ name: "Millie Bobby Brown", role: "Actor" },
			{ name: "Finn Wolfhard", role: "Actor" },
			{ name: "David Harbour", role: "Actor" },
			{ name: "Winona Ryder", role: "Actor" },
		]),
	},
	{
		code: "CA07",
		name: "Itaewon Class",
		type: "SERIES",
		cast: mkCast([
			{ name: "Park Seo-Jun", role: "Actor" },
			{ name: "Kim Da-Mi", role: "Actor" },
			{ name: "Kim Seong-yoon", role: "Director" },
			{ name: "Gwang Jin", role: "Writer" },
			{ name: "Yoo Jae-Myung", role: "Actor" },
			{ name: "Lee Joo-Young", role: "Actor" },
			{ name: "Kwon Na-Ra", role: "Actor" },
			{ name: "Ahn Bo-Hyun", role: "Actor" },
			{ name: "Kim Hye-Eun", role: "Actor" },
		]),
	},
	{
		code: "CA08",
		name: "One piece",
		type: "SERIES",
		cast: mkCast([
			{ name: "Iñaki Godoy", role: "Actor" },
			{ name: "Mackenyu", role: "Actor" },
			{ name: "Emily Rudd", role: "Actor" },
		]),
	},
	{
		code: "CA09",
		name: "Blue Lock",
		type: "SERIES",
		cast: mkCast([
			{ name: "Kazuki Ura", role: "Voice Actor" },
			{ name: "Tasuku Hatanaka", role: "Voice Actor" },
		]),
	},
]

function App() {
	const { data: session, isPending, refetch } = authClient.useSession()
	const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
	const [casts, setCasts] = useState<Cast[]>(INITIAL_CASTS)

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

	const handleSaveProduct = (updated: Product) =>
		setProducts((prev) => prev.map((p) => (p.code === updated.code ? updated : p)))
	const handleSaveCast = (updated: Cast) => setCasts((prev) => prev.map((c) => (c.code === updated.code ? updated : c)))

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

				<Route
					path="/products"
					element={user ? <ProductPage {...commonProps} data={products} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/products/edit/:code"
					element={
						user ? (
							<ProductEditPage {...commonProps} products={products} onSave={handleSaveProduct} />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				<Route
					path="/cast"
					element={user ? <CastPage {...commonProps} data={casts} /> : <Navigate to="/login" replace />}
				/>
				<Route
					path="/cast/edit/:code"
					element={
						user ? (
							<CastEditPage {...commonProps} casts={casts} onSave={handleSaveCast} />
						) : (
							<Navigate to="/login" replace />
						)
					}
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
