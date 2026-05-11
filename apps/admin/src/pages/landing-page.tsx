import { useEffect, useState } from "react"
import mockGraph from "../assets/normal.jpg"
import Navbar from "../components/navbar"
import ReportCard from "../components/report-card"
import UserCard from "../components/user-card"
import { api } from "../lib/api"
import styles from "./landing-page.module.css"

interface LandingPageProps {
	pic?: string
	username?: string
}

interface Stats {
	userCount: number
	userOneDDiffPercent: number
	orderCount: number
	orderOneDDiffPercent: number
	salesCount: number
	salesOneDDiffPercent: number
	topUsers: {
		username: string
		image: string
	}[]
	sevenDaysRevenue: {
		day: string
		revenue: number
	}[]
}

export default function LandingPage({ pic, username = "Guest" }: LandingPageProps) {
	const [data, setData] = useState<Stats | null>(null)

	useEffect(() => {
		api.admin.dash.get().then((res) => {
			if (res.status !== 200 || !res.data) {
				throw new Error("Error while getting stats")
			}
			console.log(res.data.data)
			setData(res.data.data)
		})
	}, [])

	return (
		<>
			<Navbar pic={pic} username={username} />
			<h1 className={styles.dashboardText}>Dashboard</h1>
			<div className={styles.reportContainer}>
				<div className={styles.reportCardContainer}>
					<ReportCard picIndex={1} Data={data?.userCount || 0} Changes={data?.userOneDDiffPercent} />
					<ReportCard picIndex={2} Data={data?.orderCount || 0} Changes={data?.userOneDDiffPercent} />
					<ReportCard picIndex={3} Data={data?.salesCount || 0} Changes={data?.salesOneDDiffPercent} />
				</div>
				<h1 className={styles.detailText}>Sales detail</h1>
				<div className={styles.detailContainer}>
					<div className={styles.graphContainer}>
						<img src={mockGraph} className={styles.graph} />
					</div>
					<div className={styles.topUserContainer}>
						<h1 className={styles.topUsersText}>Top Users</h1>
						{data?.topUsers.map((u) => (
							<UserCard username={u.username} />
						))}
					</div>
				</div>
			</div>
		</>
	)
}
