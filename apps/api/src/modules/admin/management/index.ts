import Elysia from "elysia"
import { banAdminAccountModel, createAdminAccountModel, getAdminAccountsModel, unbanAdminAccountModel } from "./model"
import { banAdminAccount, createAdminAccount, getAdminAccounts, unbanAdminAccount } from "./service"

export const managementModules = new Elysia({ prefix: "/manage" })
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
		{ query: getAdminAccountsModel.query, response: getAdminAccountsModel.response },
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
			response: createAdminAccountModel.response,
		},
	)
	.put(
		"/ban-admin",
		async ({ body, set, request: { headers } }) => {
			const { username } = body
			const { status, user: _user } = await banAdminAccount(username, headers)

			if (status === 404) {
				set.status = 404
				return { message: "User not found" }
			}

			if (status === 500) {
				set.status = 500
				return { message: "Internal server error" }
			}

			return { message: "Success" }
		},
		{ body: banAdminAccountModel.body, response: banAdminAccountModel.response },
	)
	.put(
		"/unban-admin",
		async ({ body, set, request: { headers } }) => {
			const { username } = body
			const { status, user: _user } = await unbanAdminAccount(username, headers)

			if (status === 404) {
				set.status = 404
				return { message: "User not found" }
			}

			if (status === 500) {
				set.status = 500
				return { message: "Internal server error" }
			}

			return { message: "Success" }
		},
		{ body: unbanAdminAccountModel.body, response: unbanAdminAccountModel.response },
	)
