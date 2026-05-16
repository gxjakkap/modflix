import { useEffect, useState } from "react"
import { api } from "../lib/api"
import AdminSessionDropdown from "./admin-session-dropdown"
import Pagination from "./Pagination"
import SearchBar from "./search-bar"

interface SessionsProps {
	onDelete: () => void
}

interface SessionRow {
	token: string
	name: string
	role: string
	device: string
}

export default function Sessions({ onDelete }: SessionsProps) {
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)
	const [data, setData] = useState<SessionRow[]>([])
	const [totalPages, setTotalPages] = useState(1)

	const [refreshKey, setRefreshKey] = useState(0)
	const PER_PAGE = 5
	useEffect(() => {
		api.admin.manage["admin-sessions"].get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
			if (res.status !== 200 || !res.data) return
			setData(res.data.data)
			setTotalPages(res.data.pagination.totalPages)
		})
	}, [search, page, refreshKey])

	return (
		<div>
			<div style={s.toolbar}>
				<SearchBar value={search} onChange={setSearch} />
			</div>

			<table style={s.table}>
				<thead>
					<tr style={s.thead}>
						{["TOK", "NAME", "ROLE", "DEVICE", ""].map((h) => (
							<th key={h} style={s.th}>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((r) => (
						<tr key={r.token} style={s.tr}>
							<td style={s.td}>{r.token}</td>
							<td style={s.td}>{r.name}</td>
							<td style={s.td}>{r.role}</td>
							<td style={s.td}>{r.device}</td>
							<td style={{ ...s.td, position: "relative" }}>
								<AdminSessionDropdown
									token={r.token}
									onRevoke={() => {
										onDelete()
										setRefreshKey((k) => k + 1)
									}}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<Pagination current={page} total={totalPages} onChange={setPage} />
		</div>
	)
}

const s: Record<string, React.CSSProperties> = {
	toolbar: { marginBottom: "30px", marginTop: "30px" },
	table: {
		width: "100%",
		borderCollapse: "collapse",
		fontSize: "16px",
		tableLayout: "fixed",
	},
	thead: { background: "#e85d00" },
	th: {
		padding: "8px",
		textAlign: "left",
		color: "#fff",
		fontWeight: "600",
		fontSize: "18px",
	},
	tr: { borderBottom: "1px solid #9f9f82" },
	td: {
		padding: "10px",
		color: "#333",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		fontSize: "16px",
	},
	badge: {
		display: "inline-block",
		padding: "2px 8px",
		borderRadius: "8px",
		fontSize: "10px",
		fontWeight: "600",
	},
}
