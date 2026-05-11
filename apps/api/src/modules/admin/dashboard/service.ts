import { Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, count, eq, gte } from "@modflix/db/orm"
import { user } from "@modflix/db/schema"

export const getUserCountAndDiff = async () => {
	const midnight = new Date()
	midnight.setHours(0, 0, 0, 0)
	const [{ count: total }] = await db
		.select({ count: count(user.id) })
		.from(user)
		.where(eq(user.role, Roles.USER))
	const [{ count: regToday }] = await db
		.select({ count: count(user.id) })
		.from(user)
		.where(and(eq(user.role, Roles.USER), gte(user.createdAt, midnight)))

	return {
		total,
		diffPercent: Math.round((regToday / total) * 100),
	}
}

/* export const getOrderCountAndDiff = async() => {
    const midnight = new Date()
	midnight.setHours(0, 0, 0, 0)

    const [{ count: totalCount }]
} */
