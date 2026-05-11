import Elysia from "elysia"
import { ErrorModel } from "@/schemas/error"
import {
	banCustomerAccountModel,
	getCustomerAccountsModel,
	getCustomerByIdModel,
	unbanCustomerAccountModel,
	updateCustomerProfileModel,
} from "./model"
import {
	banCustomerAccount,
	getCustomerAccounts,
	getCustomerById,
	unbanCustomerAccount,
	updateCustomerProfile,
} from "./service"

export const customersModules = new Elysia({ prefix: "/customers" })
	.get(
		"/get-customers-acc",
		async ({ query }) => {
			const { page, limit, search } = query
			const offset = (page - 1) * limit

			const { rows, total } = await getCustomerAccounts(offset, limit, search)

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
			query: getCustomerAccountsModel.query,
			response: {
				200: getCustomerAccountsModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/get-customer-by-id",
		async ({ query, set }) => {
			const { id } = query

			const customer = await getCustomerById(id)

			if (!customer) {
				set.status = 404
				return {
					code: 404,
					message: "Not Found",
				}
			}

			return {
				id: customer.id,
				name: customer.name,
				username: customer.username,
				email: customer.email,
			}
		},
		{
			query: getCustomerByIdModel.query,
			response: {
				200: getCustomerByIdModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.patch(
		"/update-customer",
		async ({ body, set }) => {
			const result = await updateCustomerProfile(body.userId, body)

			if (result.status !== 200) {
				set.status = result.status
				return { code: result.status, message: result.message || "An error occurred" }
			}

			return { message: "Success" }
		},
		{
			body: updateCustomerProfileModel.body,
			response: {
				200: updateCustomerProfileModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.put(
		"/ban",
		async ({ body, set, request: { headers } }) => {
			const { id } = body
			const { status, user: _user } = await banCustomerAccount(id, headers)

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
			body: banCustomerAccountModel.body,
			response: {
				200: banCustomerAccountModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.put(
		"/unban",
		async ({ body, set, request: { headers } }) => {
			const { id } = body
			const { status, user: _user } = await unbanCustomerAccount(id, headers)

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
			body: unbanCustomerAccountModel.body,
			response: {
				200: unbanCustomerAccountModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
