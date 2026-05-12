import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import TempPage from "./temp-page"

const columns = [
	{ key: "name", label: "NAME" },
	{ key: "slug", label: "SLUG" },
	{ key: "description", label: "DESCRIPTION" },
]

interface CastPageProps {
	pic?: string
	username?: string
}

interface Person {
	id: string
	name: string
	slug: string
	description: string | null
	imageId: string | null
}

export default function CastPage({ pic, username }: CastPageProps) {
	const [data, setData] = useState<Person[]>([])
	const [search, setSearch] = useState("")
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const navigate = useNavigate()

	const PER_PAGE = 5

	const fetchPeople = () => {
		api.admin.people.list.get({ query: { search, limit: PER_PAGE, page } }).then((res) => {
			if (res.status !== 200 || !res.data) return
			setData(res.data.data)
			setTotalPages(res.data.pagination.totalPages)
		})
	}

	useEffect(() => {
		fetchPeople()
	}, [search, page])

	return (
		<TempPage
			pic={pic}
			username={username}
			title="People"
			columns={columns}
			data={data}
			showCreateButton={true}
			onCreate={() => navigate("/people/create")}
			onEdit={(row) => navigate(`/people/edit/${row.id}`)}
			search={search}
			setSearch={setSearch}
			currentPage={page}
			setPage={setPage}
			totalPages={totalPages}
			deleteButtonText={() => "Delete"}
			onDelete={(row) => {
				if (window.confirm(`Are you sure you want to delete the person "${row.name}"?`)) {
					api.admin
						.people({ id: row.id })
						.delete()
						.then((res) => {
							if (res.status !== 200) {
								window.alert(`Error: [${res.error?.status}] ${res.error?.value}`)
								return
							}
							fetchPeople()
						})
				}
			}}
		/>
	)
}
