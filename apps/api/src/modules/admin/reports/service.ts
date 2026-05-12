import { Roles } from "@modflix/auth"
import { db } from "@modflix/db"
import { and, avg, count, desc, eq, gte, ilike, lt, lte, sql, sum } from "@modflix/db/orm"
import {
	episode,
	genre,
	media,
	purchasement,
	purchasementItem,
	season,
	title,
	titleGenre,
	titlePrice,
	user,
	watchProgress,
} from "@modflix/db/schema"

export const getPopularityReport = async (params: {
	type?: string
	dateFrom?: string
	dateTo?: string
	sortBy?: string
}) => {
	const { type, dateFrom, dateTo, sortBy = "genre" } = params

	const titleTypeFilter =
		type === "MOVIE" || type === "SERIES" ? eq(title.type, type as "MOVIE" | "SERIES") : undefined

	const [purchasesPerGenre, movieViews, seriesViews] = await Promise.all([
		db
			.select({ genreId: titleGenre.genreId, genreName: genre.name, purchases: count() })
			.from(purchasementItem)
			.innerJoin(title, and(eq(purchasementItem.titleId, title.id), titleTypeFilter))
			.innerJoin(titleGenre, eq(title.id, titleGenre.titleId))
			.innerJoin(genre, eq(titleGenre.genreId, genre.id))
			.innerJoin(
				purchasement,
				and(
					eq(purchasementItem.purchasementId, purchasement.id),
					dateFrom ? gte(purchasement.createdAt, new Date(dateFrom)) : undefined,
					dateTo ? lte(purchasement.createdAt, new Date(dateTo)) : undefined,
				),
			)
			.groupBy(titleGenre.genreId, genre.name),

		db
			.select({ genreId: titleGenre.genreId, views: count() })
			.from(watchProgress)
			.innerJoin(media, eq(watchProgress.mediaId, media.id))
			.innerJoin(title, and(eq(title.mediaRef, media.id), titleTypeFilter))
			.innerJoin(titleGenre, eq(title.id, titleGenre.titleId))
			.groupBy(titleGenre.genreId),

		db
			.select({ genreId: titleGenre.genreId, views: count() })
			.from(watchProgress)
			.innerJoin(media, eq(watchProgress.mediaId, media.id))
			.innerJoin(episode, eq(episode.mediaId, media.id))
			.innerJoin(season, eq(episode.seasonId, season.id))
			.innerJoin(title, and(eq(title.id, season.titleId), titleTypeFilter))
			.innerJoin(titleGenre, eq(title.id, titleGenre.titleId))
			.groupBy(titleGenre.genreId),
	])

	const viewsMap: Record<string, number> = {}
	for (const row of [...movieViews, ...seriesViews]) {
		viewsMap[row.genreId] = (viewsMap[row.genreId] ?? 0) + row.views
	}

	const table = purchasesPerGenre.map((row) => ({
		genre: row.genreName,
		views: viewsMap[row.genreId] ?? 0,
		purchase: row.purchases,
	}))

	if (sortBy === "views") table.sort((a, b) => b.views - a.views)
	else if (sortBy === "purchase") table.sort((a, b) => b.purchase - a.purchase)
	else table.sort((a, b) => a.genre.localeCompare(b.genre))

	const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
	const monthlyRaw = await db
		.select({
			month: sql<string>`to_char(${purchasement.createdAt}, 'Mon')`,
			monthOrder: sql<number>`extract(epoch from date_trunc('month', ${purchasement.createdAt}))`,
			genreName: genre.name,
			cnt: count(),
		})
		.from(purchasementItem)
		.innerJoin(title, titleTypeFilter ? and(eq(purchasementItem.titleId, title.id), titleTypeFilter) : eq(purchasementItem.titleId, title.id))
		.innerJoin(titleGenre, eq(title.id, titleGenre.titleId))
		.innerJoin(genre, eq(titleGenre.genreId, genre.id))
		.innerJoin(
			purchasement,
			and(eq(purchasementItem.purchasementId, purchasement.id), gte(purchasement.createdAt, sixMonthsAgo)),
		)
		.groupBy(
			sql`to_char(${purchasement.createdAt}, 'Mon')`,
			sql`date_trunc('month', ${purchasement.createdAt})`,
			genre.name,
		)
		.orderBy(sql`date_trunc('month', ${purchasement.createdAt})`)

	const chartMap: Record<string, Record<string, number | string>> = {}
	for (const row of monthlyRaw) {
		if (!chartMap[row.month]) chartMap[row.month] = { _order: row.monthOrder }
		chartMap[row.month][row.genreName.toLowerCase().replace(/[\s-]/g, "")] = row.cnt
	}
	const chart = Object.entries(chartMap)
		.sort(([, a], [, b]) => (a._order as number) - (b._order as number))
		.map(([month, { _order: _, ...rest }]) => ({ month, ...rest }))

	return { table, chart }
}

export const getSalesReport = async (params: {
	product?: string
	dateFrom?: string
	dateTo?: string
	status?: string
}) => {
	const { product, dateFrom, dateTo, status } = params

	const validStatus =
		status === "PENDING" || status === "SUCCESS" || status === "FAILED"
			? (status as "PENDING" | "SUCCESS" | "FAILED")
			: undefined

	const conditions = and(
		product ? ilike(title.name, `%${product}%`) : undefined,
		dateFrom ? gte(purchasement.createdAt, new Date(dateFrom)) : undefined,
		dateTo ? lte(purchasement.createdAt, new Date(dateTo)) : undefined,
		validStatus ? eq(purchasement.status, validStatus) : undefined,
	)

	const summaryRaw = await db
		.select({
			titleId: title.id,
			name: title.name,
			quantity: count(),
			revenue: sum(titlePrice.price),
		})
		.from(purchasementItem)
		.innerJoin(title, eq(purchasementItem.titleId, title.id))
		.innerJoin(purchasement, eq(purchasementItem.purchasementId, purchasement.id))
		.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
		.where(conditions)
		.groupBy(title.id, title.name)
		.orderBy(desc(count()))

	const summary = summaryRaw.map((row) => ({
		product: row.titleId.substring(0, 6).toUpperCase(),
		name: row.name,
		quantity: row.quantity,
		revenue: Number(row.revenue ?? 0),
	}))

	const weeklyRaw = await db
		.select({
			week: sql<string>`to_char(date_trunc('week', ${purchasement.createdAt}), 'YYYY-MM-DD')`,
			weekOrder: sql<number>`extract(epoch from date_trunc('week', ${purchasement.createdAt}))`,
			titleName: title.name,
			cnt: count(),
		})
		.from(purchasementItem)
		.innerJoin(title, eq(purchasementItem.titleId, title.id))
		.innerJoin(purchasement, eq(purchasementItem.purchasementId, purchasement.id))
		.innerJoin(titlePrice, eq(purchasementItem.priceId, titlePrice.id))
		.where(conditions)
		.groupBy(sql`date_trunc('week', ${purchasement.createdAt})`, title.name)
		.orderBy(sql`date_trunc('week', ${purchasement.createdAt})`)
		.limit(100)

	const chartMap: Record<string, Record<string, number | string>> = {}
	for (const row of weeklyRaw) {
		if (!chartMap[row.week]) chartMap[row.week] = { _order: row.weekOrder }
		const key = row.titleName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)
		chartMap[row.week][key] = row.cnt
	}
	const chart = Object.entries(chartMap)
		.sort(([, a], [, b]) => (a._order as number) - (b._order as number))
		.map(([date, { _order: _, ...rest }]) => ({ date, ...rest }))

	return { summary, chart }
}

export const getUserBehaviorReport = async (params: {
	duration?: string
	category?: string
	dateRange?: string
}) => {
	const { duration, category, dateRange = "Last 7 Days" } = params

	const daysBack = dateRange === "Last 3 Months" ? 90 : dateRange === "Last 30 Days" ? 30 : 7
	const since = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)

	// Duration filter for ORM queries
	const durationFilter =
		duration === "0 - 30 min" ? lt(watchProgress.progress, 1800) :
		duration === "30 - 60 min" ? and(gte(watchProgress.progress, 1800), lt(watchProgress.progress, 3600)) :
		duration === "1h+" ? gte(watchProgress.progress, 3600) :
		undefined

	// Duration + category SQL fragments for raw queries
	const durationSql =
		duration === "0 - 30 min" ? sql` AND wp.progress < 1800` :
		duration === "30 - 60 min" ? sql` AND wp.progress >= 1800 AND wp.progress < 3600` :
		duration === "1h+" ? sql` AND wp.progress >= 3600` :
		sql``

	const categorySql = category
		? sql` AND EXISTS (
				SELECT 1 FROM title t
				JOIN title_genre tg ON tg.title_id = t.id
				JOIN genre g ON g.id = tg.genre_id
				WHERE g.name = ${category}
				AND (
					t.media_ref = wp.media_id
					OR EXISTS (
						SELECT 1 FROM episode ep
						JOIN season s ON s.id = ep.season_id
						WHERE ep.media_id = wp.media_id AND s.title_id = t.id
					)
				)
			)`
		: sql``

	const [totalResult, activeResult, completionResult] = await Promise.all([
		db.select({ total: count() }).from(user).where(eq(user.role, Roles.USER)),
		db
			.select({ active: sql<number>`count(distinct ${watchProgress.userId})` })
			.from(watchProgress)
			.where(and(gte(watchProgress.lastViewed, since), durationFilter)),
		db
			.select({
				totalSessions: count(),
				completed: sql<number>`count(case when ${media.duration} > 0 and ${watchProgress.progress}::float / ${media.duration} >= 0.8 then 1 end)`,
				avgProgress: avg(watchProgress.progress),
			})
			.from(watchProgress)
			.innerJoin(media, eq(watchProgress.mediaId, media.id))
			.where(and(gte(watchProgress.lastViewed, since), durationFilter)),
	])

	const totalUsers = totalResult[0]?.total ?? 0
	const activeUsers = Number(activeResult[0]?.active ?? 0)
	const totalSessions = completionResult[0]?.totalSessions ?? 0
	const completedSessions = Number(completionResult[0]?.completed ?? 0)
	const avgProgressSecs = Math.round(Number(completionResult[0]?.avgProgress ?? 0))
	const avgWatchMins = Math.floor(avgProgressSecs / 60)
	const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0
	const dropoffRate = 100 - completionRate

	const sparklineRaw = await db.execute<{ active: number }>(sql`
		SELECT
			gs::date as day,
			count(distinct wp.user_id)::int as active
		FROM generate_series(now() - interval '7 days', now(), interval '1 day') gs
		LEFT JOIN watch_progress wp ON wp.last_viewed::date = gs::date
		GROUP BY gs
		ORDER BY gs
	`)
	const sparkline = sparklineRaw.rows.map((r) => Number(r.active))

	const segRaw = await db.execute<{
		segment: string
		views: number
		avg_watch_secs: number
		total_sessions: number
		completed_sessions: number
	}>(sql`
		SELECT
			CASE
				WHEN EXISTS (
					SELECT 1 FROM purchasement p
					WHERE p.purchaser = u.id AND p.status = 'SUCCESS'
				) THEN 'Premium Users'
				WHEN u.created_at >= now() - interval '30 days' THEN 'New Users'
				ELSE 'Returning Users'
			END as segment,
			count(distinct wp.media_id)::int as views,
			coalesce(round(avg(wp.progress)::numeric, 0), 0)::int as avg_watch_secs,
			count(wp.media_id)::int as total_sessions,
			count(case when m.duration > 0 and wp.progress::float / m.duration >= 0.8 then 1 end)::int as completed_sessions
		FROM "user" u
		LEFT JOIN watch_progress wp ON wp.user_id = u.id AND wp.last_viewed >= ${since}${durationSql}${categorySql}
		LEFT JOIN media m ON m.id = wp.media_id
		WHERE u.role = ${Roles.USER}
		GROUP BY segment
		ORDER BY segment
	`)

	const table = segRaw.rows.map((row) => {
		const mins = Math.floor(row.avg_watch_secs / 60)
		const secs = row.avg_watch_secs % 60
		const comp = row.total_sessions > 0 ? Math.round((row.completed_sessions / row.total_sessions) * 100) : 0
		return {
			segment: row.segment,
			views: row.views.toLocaleString(),
			avgWatch: `${mins}m ${secs}s`,
			completion: `${comp}%`,
			dropoff: `${100 - comp}%`,
		}
	})

	const metrics = [
		{
			label: "Total Users",
			value: String(totalUsers),
			sub: "registered users",
			bars: sparkline.map(() => totalUsers),
			bg: "#dde3f0",
			color: "#7090c0",
		},
		{
			label: "Active Users",
			value: String(activeUsers),
			sub: `active in last ${daysBack} days`,
			bars: sparkline,
			bg: "#fff0e0",
			color: "#e85d00",
		},
		{
			label: "Avg Watch Time",
			value: String(avgWatchMins),
			sub: "mins / session",
			bars: sparkline,
			bg: "#e8e8f0",
			color: "#8888cc",
		},
		{
			label: "Drop-off Rate",
			value: `${dropoffRate}%`,
			sub: "of all sessions",
			bars: sparkline,
			bg: "#f5e0e0",
			color: "#cc3333",
		},
	]

	return { table, metrics }
}
