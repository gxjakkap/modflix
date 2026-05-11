import { AdminRole, AdminRoles, auth, Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, count, eq, ilike, inArray, sql } from "@modflix/db/orm"
import { session, user } from "@modflix/db/schema"

export const getAdminAccounts = async (offset: number, limit: number, search?: string) => {
	const where = and(inArray(user.role, Array.from(AdminRoles)), search ? ilike(user.name, `%${search}%`) : undefined)

	const [rows, [{ total }]] = await Promise.all([
		db
			.select({
				username: user.username,
				name: user.name,
				role: sql<string>`coalesce(${user.role}, ${Roles.ADMIN})`,
				lastLogin: sql<Date>`coalesce(max(${session.updatedAt}), ${user.createdAt})`,
				email: user.email,
			})
			.from(user)
			.leftJoin(session, eq(session.userId, user.id))
			.where(where)
			.groupBy(user.id, user.name, user.role, user.email, user.createdAt)
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(user).where(where),
	])
	return {
		rows,
		total,
	}
}

export const createAdminAccount = async (
	email: string,
	username: string,
	name: string,
	password: string,
	role: AdminRole,
) => {
	const newUser = await auth.api.createUser({
		body: {
			email,
			password,
			name,
			role,
			data: {
				username,
			},
		},
	})

	return newUser
}
