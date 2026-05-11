import Elysia from "elysia"
import { createAdminAccountModel, getAdminAccountsModel } from "./model"
import { createAdminAccount, getAdminAccounts } from "./service"

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
