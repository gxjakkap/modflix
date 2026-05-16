import { useEffect, useState } from "react"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
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
	sevenDaysPurchasements: {
		day: string
		count: number
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
					<ReportCard picIndex={2} Data={data?.orderCount || 0} Changes={data?.orderOneDDiffPercent} />
					<ReportCard picIndex={3} Data={data?.salesCount || 0} Changes={data?.salesOneDDiffPercent} />
				</div>
				<h1 className={styles.detailText}>Sales detail</h1>
				<div className={styles.detailContainer}>
					<div className={styles.graphContainer} style={{ padding: "24px 16px 16px" }}>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data?.sevenDaysPurchasements ?? []} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#f0dcc8" />
								<XAxis
									dataKey="day"
									tick={{ fontSize: 11, fill: "#888" }}
									tickFormatter={(v) => String(v).slice(5)}
									tickLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11, fill: "#888" }}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
									domain={[0, "auto"]}
								/>
								<Tooltip
									formatter={(value: any) => [value ?? 0, "Purchasements"]}
									labelFormatter={(label: any) => `Date: ${String(label ?? "")}`}
								/>
								<Line
									type="monotone"
									dataKey="count"
									name="Purchasements"
									stroke="#e85d00"
									strokeWidth={2.5}
									dot={{ r: 4, fill: "#e85d00", strokeWidth: 0 }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
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
