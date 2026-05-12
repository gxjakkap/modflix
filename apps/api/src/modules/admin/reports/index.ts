import Elysia from "elysia"
import { ErrorModel } from "@/schemas/error"
import { getPopularityReportModel, getSalesReportModel, getUserBehaviorReportModel } from "./model"
import { getPopularityReport, getSalesReport, getUserBehaviorReport } from "./service"

export const reportsModule = new Elysia({ prefix: "/reports" })
	.get(
		"/popularity",
		async ({ query }) => getPopularityReport(query),
		{
			query: getPopularityReportModel.query,
			response: {
				200: getPopularityReportModel.response,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/sales",
		async ({ query }) => getSalesReport(query),
		{
			query: getSalesReportModel.query,
			response: {
				200: getSalesReportModel.response,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/user-behavior",
		async ({ query }) => getUserBehaviorReport(query),
		{
			query: getUserBehaviorReportModel.query,
			response: {
				200: getUserBehaviorReportModel.response,
				500: ErrorModel,
			},
		},
	)
