import { t } from "elysia"

export const getAdminAccountsModel = {
	query: t.Object({
		page: t.Numeric({ default: 1, minimum: 1 }),
		limit: t.Numeric({ default: 20, minimum: 1, maximum: 100 }),
		search: t.Optional(t.String()),
	}),
	response: t.Object({
		data: t.Array(
			t.Object({
				username: t.String(),
				name: t.String(),
				role: t.String(),
				lastLogin: t.Date(),
				email: t.String({ format: "email" }),
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

export const createAdminAccountModel = {
	body: t.Object({
		email: t.String({ format: "email" }),
		username: t.String(),
		fullName: t.String(),
		password: t.String(),
		role: t.Union([t.Literal("super_admin"), t.Literal("admin")]),
	}),
	response: t.Object({
		message: t.String(),
	}),
}

export const banAdminAccountModel = {
	body: t.Object({
		username: t.String(),
	}),
	response: t.Object({
		message: t.String(),
	}),
}

export const unbanAdminAccountModel = {
	body: t.Object({
		username: t.String(),
	}),
	response: t.Object({
		message: t.String(),
	}),
}
