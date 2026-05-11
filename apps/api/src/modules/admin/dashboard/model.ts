import { t } from "elysia"

export const DashboardModel = {
	response: t.Object({
		data: t.Object({
			userCount: t.Number(),
			userDiffPercent: t.Number(),
			orderCount: t.Number(),
			orderDiffPercent: t.Number(),
			salesCount: t.Number(),
			salesDiffPercent: t.Number(),
		}),
	}),
}
