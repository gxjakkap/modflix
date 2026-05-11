import { auth, Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, count, eq, ilike, isNotNull, ne, or, sql } from "@modflix/db/orm"
import { user } from "@modflix/db/schema"

export const getCustomerAccounts = async (offset: number, limit: number, search?: string) => {
	const where = and(
		eq(user.role, Roles.USER),
		or(search ? ilike(user.name, `%${search}%`) : undefined, search ? ilike(user.email, `%${search}%`) : undefined),
		isNotNull(user.username),
	)

	const [rows, [{ total }]] = await Promise.all([
		db
			.select({
				id: user.id,
				name: user.name,
				username: sql<string>`${user.username}`,
				email: user.email,
				dateRegistered: user.createdAt,
				isBanned: sql<boolean>`coalesce(${user.banned}, false)`,
			})
			.from(user)
			.where(where)
			.limit(limit)
			.offset(offset),
		db.select({ total: count() }).from(user).where(where),
	])
	return {
		rows,
		total,
	}
}

export const getCustomerById = async (id: string) => {
	const where = and(eq(user.role, Roles.USER), eq(user.id, id))
	const [customer] = await db
		.select({ id: user.id, name: user.name, email: user.email, username: sql<string>`${user.username}` })
		.from(user)
		.where(where)
	return customer
}

export const updateCustomerProfile = async (userId: string, data: { fullName: string; username: string }) => {
	try {
		const existing = await getCustomerById(userId)
		if (!existing) {
			return { status: 404, message: "Customer not found" }
		}

		const updateBody: { name?: string; username?: string } = {}

		if (data.fullName !== existing.name) {
			updateBody.name = data.fullName
		}

		if (data.username !== existing.username) {
			updateBody.username = data.username
		}

		if (Object.keys(updateBody).length === 0) {
			return { status: 200 }
		}

		console.log("Updating profile via database for user ID:", userId)
		const updated = await db.update(user).set(updateBody).where(eq(user.id, userId)).returning()

		console.log("Profile update result:", updated)
		return {
			status: 200,
		}
		// biome-ignore lint/suspicious/noExplicitAny: <>
	} catch (e: any) {
		console.error("Failed to update profile:", e)

		if (e.code === "23505" && e.constraint === "user_username_unique") {
			return {
				status: 400,
				message: "Username is already taken. Please try another.",
			}
		}

		return {
			status: 500,
			message: "Internal server error",
		}
	}
}

export const banCustomerAccount = async (id: string, headers: Headers) => {
	const [target] = await db
		.select()
		.from(user)
		.where(and(eq(user.id, id), ne(user.banned, true)))
		.limit(1)
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

export const unbanCustomerAccount = async (id: string, headers: Headers) => {
	const [target] = await db
		.select()
		.from(user)
		.where(and(eq(user.id, id), eq(user.banned, true)))
		.limit(1)
	if (!target) {
		return {
			status: 404,
			user: null,
		}
	}
	try {
		const banned = await auth.api.unbanUser({
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
