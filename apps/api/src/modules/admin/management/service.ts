import { AdminRole, AdminRoles, auth, Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, count, eq, ilike, inArray, isNotNull, or, sql } from "@modflix/db/orm"
import { session, user } from "@modflix/db/schema"

export const getAdminAccounts = async (offset: number, limit: number, search?: string) => {
	const where = and(
		inArray(user.role, Array.from(AdminRoles)),
		or(
			search ? ilike(user.name, `%${search}%`) : undefined,
			search ? ilike(user.email, `%${search}%`) : undefined,
			search ? ilike(user.username, `%${search}%`) : undefined,
		),
		isNotNull(user.username),
	)

	const [rows, [{ total }]] = await Promise.all([
		db
			.select({
				username: sql<string>`${user.username}`,
				name: user.name,
				role: sql<string>`coalesce(${user.role}, ${Roles.ADMIN})`,
				lastLogin: sql<Date>`coalesce(max(${session.updatedAt}), ${user.createdAt})`,
				email: user.email,
				isBanned: sql<boolean>`coalesce(${user.banned}, false)`,
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

export const banAdminAccount = async (username: string, headers: Headers) => {
	const [target] = await db.select().from(user).where(eq(user.username, username)).limit(1)
	if (!target) {
		return {
			status: 404,
			user: null,
		}
	}
	try {
		const banned = await auth.api.banUser({
			body: {
				userId: target.id,
			},
			headers,
		})
		console.log("Ban result:", banned)
		return {
			status: 200,
			user: banned,
		}
	} catch (e) {
		console.error("Failed to ban user:", e)
		return {
			status: 500,
			user: null,
		}
	}
}

export const unbanAdminAccount = async (username: string, headers: Headers) => {
	const [target] = await db.select().from(user).where(eq(user.username, username)).limit(1)
	if (!target) {
		return {
			status: 404,
			user: null,
		}
	}
	try {
		const unbanned = await auth.api.unbanUser({
			body: {
				userId: target.id,
			},
			headers,
		})
		console.log("Unban result:", unbanned)
		return {
			status: 200,
			user: unbanned,
		}
	} catch (e) {
		console.error("Failed to unban user:", e)
		return {
			status: 500,
			user: null,
		}
	}
}
