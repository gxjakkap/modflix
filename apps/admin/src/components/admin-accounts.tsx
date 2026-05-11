import { useEffect, useState } from "react"
import { api } from "../lib/api"
import Dropdown from "./dropdown"
import Pagination from "./pagination"
import SearchBar from "./search-bar"

const ACTIONS = ["Delete", "Suspend"]

interface AdminAccountsProps {
	onAddAdmin: () => void
	onDelete: (id: string) => void
}

interface AdminAccountData {
	username: string | null
	name: string
	role: string
	lastLogin: Date
	email: string
}

function AdminAccounts({ onAddAdmin, onDelete }: AdminAccountsProps) {
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)
	const [data, setData] = useState<AdminAccountData[]>([])
	const [totalPages, setTotalPages] = useState(1)

	const PER_PAGE = 5

	useEffect(() => {
		api.admin.manage["admin-acc"].get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
			if (res.status !== 200 || !res.data) return
			setData(res.data.data)
			setTotalPages(res.data.pagination.totalPages)
		})
	}, [search, page])

	return (
		<div>
			<div style={s.toolbar}>
				<SearchBar value={search} onChange={setSearch} />
				<button style={s.btn} onClick={onAddAdmin}>
					ADD ADMIN +
				</button>
			</div>

			<table style={s.table}>
				<thead>
					<tr style={s.thead}>
						<Th w="8%">USERNAME</Th>
						<Th w="18%">NAME</Th>
						<Th w="14%">ROLE</Th>
						<Th w="20%">LAST LOGIN</Th>
						<Th w="28%">EMAIL</Th>
						<Th w="12%"></Th>
					</tr>
				</thead>
				<tbody>
					{data.map((a) => (
						<tr key={a.username} style={s.tr}>
							<td style={s.td}>{a.username}</td>
							<td style={s.td}>{a.name}</td>
							<td style={s.td}>{a.role}</td>
							<td style={s.td}>{a.lastLogin.toDateString()}</td>
							<td style={s.td}>{a.email}</td>
							<td style={{ ...s.td, position: "relative" }}>
								<Dropdown actions={ACTIONS} onDelete={() => onDelete(a.id)} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination current={page} total={totalPages} onChange={setPage} />
		</div>
	)
}

interface ThProps {
	children?: React.ReactNode
	w?: string
}

const Th = ({ children, w }: ThProps) => <th style={{ ...s.th, width: w || "auto" }}>{children}</th>

export default AdminAccounts

const s: Record<string, React.CSSProperties> = {
	toolbar: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "30px",
		marginTop: "30px",
	},
	btn: {
		background: "#e85d00",
		color: "#fff",
		border: "none",
		borderRadius: "20px",
		padding: "7px 14px",
		fontSize: "18px",
		fontWeight: "600",
		cursor: "pointer",
	},
	table: { width: "100%", borderCollapse: "collapse", fontSize: "16px" },
	th: { padding: "10px", textAlign: "left", color: "#fff", fontWeight: "600", fontSize: "18px" },
	td: { padding: "10px", color: "#333", fontSize: "16px" },
	thead: { background: "#e85d00" },
	tr: { borderBottom: "1px solid #9f9f82" },
}
