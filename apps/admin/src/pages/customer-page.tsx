import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import TempPage from "./temp-page"

const columns = [
	{ key: "username", label: "USERNAME" },
	{ key: "name", label: "NAME" },
	{ key: "email", label: "EMAIL" },
	{ key: "dateRegistered", label: "REGISTERED" },
]

interface CustomerPageProps {
	pic?: string
	username?: string
}

interface Customer {
	id: string
	name: string
	username: string
	email: string
	isBanned: boolean
	dateRegistered: Date
}

export default function CustomerPage({ pic, username }: CustomerPageProps) {
	const [data, setData] = useState<Customer[]>([])
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const navigate = useNavigate()

	const PER_PAGE = 5

	useEffect(() => {
		api.admin.customers.list.get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
			if (res.status !== 200 || !res.data) return

			const formattedData = res.data.data.map((d) => ({
				...d,
				dateRegistered: new Date(d.dateRegistered).toLocaleDateString("th-TH", { dateStyle: "short" }),
			})) as unknown as Customer[]

			setData(formattedData)
			setTotalPages(res.data.pagination.totalPages)
		})
	}, [search, page])

	return (
		<TempPage
			pic={pic}
			username={username}
			title="Customer"
			columns={columns}
			data={data}
			onEdit={(row) => navigate(`/customers/edit/${row.id}`)}
			deleteButtonText={(row) => (row.isBanned ? "Unban" : "Ban")}
			onDelete={(row) => {
				if (window.confirm(`You are ${row.isBanned ? "un" : ""}banning user ${row.username}. Are you sure?`)) {
					if (row.isBanned) {
						api.admin.customers.unban
							.put({
								id: row.id,
							})
							.then((res) => {
								if (res.status !== 200) {
									window.alert(`Error: [${res.error?.status}] ${res.error?.value}`)
									return
								}
								api.admin.customers.list.get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
									if (res.status !== 200 || !res.data) return

									const formattedData = res.data.data.map((d) => ({
										...d,
										dateRegistered: new Date(d.dateRegistered).toLocaleDateString("th-TH", { dateStyle: "short" }),
									})) as unknown as Customer[]

									setData(formattedData)
									setTotalPages(res.data.pagination.totalPages)
								})
							})
					} else {
						api.admin.customers.ban
							.put({
								id: row.id,
							})
							.then((res) => {
								if (res.status !== 200) {
									window.alert(`Error: [${res.error?.status}] ${res.error?.value}`)
									return
								}
								api.admin.customers.list.get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
									if (res.status !== 200 || !res.data) return

									const formattedData = res.data.data.map((d) => ({
										...d,
										dateRegistered: new Date(d.dateRegistered).toLocaleDateString("th-TH", { dateStyle: "short" }),
									})) as unknown as Customer[]

									setData(formattedData)
									setTotalPages(res.data.pagination.totalPages)
								})
							})
					}
				}
			}}
			search={search}
			setSearch={setSearch}
			totalPages={totalPages}
			currentPage={page}
			setPage={setPage}
		/>
	)
}
