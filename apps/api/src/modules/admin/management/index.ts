import Elysia from "elysia"
import { ErrorModel } from "@/schemas/error"
import {
	banAdminAccountModel,
	createAdminAccountModel,
	getAdminAccountsModel,
	unbanAdminAccountModel,
	updateAdminProfileModel,
} from "./model"
import { banAdminAccount, createAdminAccount, getAdminAccounts, unbanAdminAccount, updateAdminProfile } from "./service"

export const managementModules = new Elysia({ prefix: "/manage" })
	.patch(
		"/update-profile",
		async ({ body, set, request: { headers } }) => {
			const { status } = await updateAdminProfile(body.userId, body, headers)

			if (status === 500) {
				set.status = 500
				return { code: 500, message: "Internal server error" }
			}

			return { message: "Success" }
		},
		{
			body: updateAdminProfileModel.body,
			response: {
				200: updateAdminProfileModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/admin-acc",
		async ({ query }) => {
			const { page, limit, search } = query
			const offset = (page - 1) * limit

			const { rows, total } = await getAdminAccounts(offset, limit, search)

			console.log(rows)
			console.log(total)

			return {
				data: rows,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
					hasNext: page * limit < total,
					hasPrev: page > 1,
				},
			}
		},
		{
			query: getAdminAccountsModel.query,
			response: {
				200: getAdminAccountsModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.post(
		"/create-admin-acc",
		async ({ body }) => {
			const { email, username, fullName, password, role } = body

			const _usr = await createAdminAccount(email, username, fullName, password, role)

			return {
				message: "Success",
			}
		},
		{
			body: createAdminAccountModel.body,
			response: {
				200: createAdminAccountModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.put(
		"/ban-admin",
		async ({ body, set, request: { headers } }) => {
			const { username } = body
			const { status, user: _user } = await banAdminAccount(username, headers)

			if (status === 404) {
				set.status = 404
				return { code: 404, message: "User not found" }
			}

			if (status === 500) {
				set.status = 500
				return { code: 500, message: "Internal server error" }
			}

			return { message: "Success" }
		},
		{
			body: banAdminAccountModel.body,
			response: {
				200: banAdminAccountModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.put(
		"/unban-admin",
		async ({ body, set, request: { headers } }) => {
			const { username } = body
			const { status, user: _user } = await unbanAdminAccount(username, headers)

			if (status === 404) {
				set.status = 404
				return { code: 404, message: "User not found" }
			}

			if (status === 500) {
				set.status = 500
				return { code: 500, message: "Internal server error" }
			}

			return { message: "Success" }
		},
		{
			body: unbanAdminAccountModel.body,
			response: {
				200: unbanAdminAccountModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
