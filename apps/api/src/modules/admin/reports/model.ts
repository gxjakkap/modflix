import { t } from "elysia"

export const getPopularityReportModel = {
	query: t.Object({
		type: t.Optional(t.String()),
		dateFrom: t.Optional(t.String()),
		dateTo: t.Optional(t.String()),
		sortBy: t.Optional(t.String()),
	}),
	response: t.Object({
		table: t.Array(
			t.Object({
				genre: t.String(),
				views: t.Number(),
				purchase: t.Number(),
			}),
		),
		chart: t.Array(t.Any()),
	}),
}

export const getSalesReportModel = {
	query: t.Object({
		product: t.Optional(t.String()),
		dateFrom: t.Optional(t.String()),
		dateTo: t.Optional(t.String()),
		status: t.Optional(t.String()),
	}),
	response: t.Object({
		summary: t.Array(
			t.Object({
				product: t.String(),
				name: t.String(),
				quantity: t.Number(),
				revenue: t.Number(),
			}),
		),
		chart: t.Array(t.Any()),
	}),
}

export const getUserBehaviorReportModel = {
	query: t.Object({
		duration: t.Optional(t.String()),
		category: t.Optional(t.String()),
		dateRange: t.Optional(t.String()),
	}),
	response: t.Object({
		table: t.Array(
			t.Object({
				segment: t.String(),
				views: t.String(),
				avgWatch: t.String(),
				completion: t.String(),
				dropoff: t.String(),
			}),
		),
		metrics: t.Array(t.Any()),
	}),
}
