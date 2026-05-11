import { t } from "elysia"

export const getCustomerAccountsModel = {
	query: t.Object({
		page: t.Numeric({ default: 1, minimum: 1 }),
		limit: t.Numeric({ default: 20, minimum: 1, maximum: 100 }),
		search: t.Optional(t.String()),
	}),
	response: t.Object({
		data: t.Array(
			t.Object({
				id: t.String(),
				name: t.String(),
				username: t.Nullable(t.String()),
				email: t.String({ format: "email" }),
				dateRegistered: t.Date(),
				isBanned: t.Boolean(),
			}),
		),
		pagination: t.Object({
			page: t.Number(),
			limit: t.Number(),
			total: t.Number(),
			totalPages: t.Number(),
			hasNext: t.Boolean(),
			hasPrev: t.Boolean(),
		}),
	}),
}

export const getCustomerByIdModel = {
	query: t.Object({
		id: t.String(),
	}),
	response: t.Object({
		id: t.String(),
		name: t.String(),
		username: t.String(),
		email: t.String({ format: "email" }),
	}),
}

export const updateCustomerProfileModel = {
	body: t.Object({
		userId: t.String(),
		fullName: t.String(),
		username: t.String(),
	}),
	response: t.Object({
		message: t.String(),
	}),
}

export const banCustomerAccountModel = {
	body: t.Object({
		id: t.String(),
	}),
	response: t.Object({
		message: t.String(),
	}),
}

export const unbanCustomerAccountModel = {
	body: t.Object({
		id: t.String(),
	}),
	response: t.Object({
		message: t.String(),
	}),
}
