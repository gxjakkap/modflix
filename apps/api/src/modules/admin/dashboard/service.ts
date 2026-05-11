import { Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, count, desc, eq, gte, sql } from "@modflix/db/orm"
import { purchasement, purchasementItem, purchasementStatus, titlePrice, user } from "@modflix/db/schema"

export const getUserCountAndDiff = async () => {
	const midnight = new Date()
	midnight.setHours(0, 0, 0, 0)
	const [[{ total }], [{ regToday }]] = await Promise.all([
		db
			.select({ total: count(user.id) })
			.from(user)
			.where(eq(user.role, Roles.USER)),
		db
			.select({ regToday: count(user.id) })
			.from(user)
			.where(and(eq(user.role, Roles.USER), gte(user.createdAt, midnight))),
	])

	return {
		total: Number(total),
		diffPercent: Number(total) === 0 ? 0 : Math.round((Number(regToday) / Number(total)) * 100),
	}
}

export const getSalesAndDiff = async () => {
	const midnight = new Date()
	midnight.setHours(0, 0, 0, 0)

	const [[{ totalRevenue }], [{ revenueToday }]] = await Promise.all([
		db
			.select({ totalRevenue: sql<number>`coalesce(sum(${titlePrice.price}), 0)` })
			.from(purchasement)
			.innerJoin(purchasementItem, eq(purchasement.id, purchasementItem.purchasementId))
			.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
			.where(eq(purchasement.status, purchasementStatus.enumValues[1])),
		db
			.select({ revenueToday: sql<number>`coalesce(sum(${titlePrice.price}), 0)` })
			.from(purchasement)
			.innerJoin(purchasementItem, eq(purchasement.id, purchasementItem.purchasementId))
			.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
			.where(and(eq(purchasement.status, purchasementStatus.enumValues[1]), gte(purchasement.createdAt, midnight))),
	])

	return {
		total: Number(totalRevenue),
		diffPercent: Number(totalRevenue) === 0 ? 0 : Math.round((Number(revenueToday) / Number(totalRevenue)) * 100),
	}
}

export const getOrderCountAndDiff = async () => {
	const midnight = new Date()
	midnight.setHours(0, 0, 0, 0)

	const [[{ totalCount }], [{ orderToday }]] = await Promise.all([
		db
			.select({ totalCount: count(purchasement.id) })
			.from(purchasement)
			.where(eq(purchasement.status, purchasementStatus.enumValues[1])),
		db
			.select({ orderToday: count(purchasement.id) })
			.from(purchasement)
			.where(and(eq(purchasement.status, purchasementStatus.enumValues[1]), gte(purchasement.createdAt, midnight))),
	])

	return {
		total: Number(totalCount),
		diffPercent: Number(totalCount) === 0 ? 0 : Math.round((Number(orderToday) / Number(totalCount)) * 100),
	}
}

export const getTopThreePayingCustomer = async () => {
	const rows = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: sql<string>`coalesce(${user.image}, '')`,
			totalSpent: sql<number>`coalesce(sum(${titlePrice.price}), 0)`,
		})
		.from(user)
		.innerJoin(
			purchasement,
			and(eq(user.id, purchasement.purchaser), eq(purchasement.status, purchasementStatus.enumValues[1])),
		)
		.innerJoin(purchasementItem, eq(purchasement.id, purchasementItem.purchasementId))
		.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
		.groupBy(user.id, user.name, user.email, user.image)
		.orderBy(desc(sql<number>`sum(${titlePrice.price})`))
		.limit(3)
	return rows
}

export const getLastSevenDaysRevenue = async () => {
	const startDate = new Date()
	startDate.setHours(0, 0, 0, 0)
	startDate.setDate(startDate.getDate() - 6)

	const day = sql<string>`to_char(date_trunc('day', ${purchasement.createdAt}), 'YYYY-MM-DD')`

	const rows = await db
		.select({
			day,
			revenue: sql<number>`coalesce(sum(${titlePrice.price}), 0)`,
		})
		.from(purchasement)
		.innerJoin(purchasementItem, eq(purchasement.id, purchasementItem.purchasementId))
		.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
		.where(and(eq(purchasement.status, purchasementStatus.enumValues[1]), gte(purchasement.createdAt, startDate)))
		.groupBy(day)
		.orderBy(day)

	return rows.map(r => ({ ...r, revenue: Number(r.revenue) }))
}
