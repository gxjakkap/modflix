/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { db } from "@modflix/db"
import { and, count, eq, ilike, inArray, isNull, or } from "@modflix/db/orm"
import { cartItem, episode, file, media, purchasementItem, season, title, titleGenre, titlePeople, titlePrice, userLibrary } from "@modflix/db/schema"
import { getPresignedUrl, uploadToS3 } from "./storage"

export const getProducts = async (offset: number, limit: number, search?: string) => {
	const where = search ? or(ilike(title.name, `%${search}%`), ilike(title.slug, `%${search}%`)) : undefined

	const [totalCount, rows] = await Promise.all([
		db
			.select({ count: count(title.id) })
			.from(title)
			.where(where),
		db
			.select({
				id: title.id,
				name: title.name,
				slug: title.slug,
				type: title.type,
				price: titlePrice.price,
			})
			.from(title)
			.leftJoin(titlePrice, eq(title.id, titlePrice.titleId))
			.where(where)
			.limit(limit)
			.offset(offset),
	])

	return {
		rows,
		total: totalCount[0]?.count ?? 0,
	}
}

export const getProductById = async (id: string) => {
	const [row] = await db
		.select({
			id: title.id,
			name: title.name,
			slug: title.slug,
			type: title.type,
			releaseDate: title.releaseDate,
			price: titlePrice.price,
			posterFileId: title.imagePosterId,
			bannerFileId: title.imageBannerId,
			mediaId: media.id,
			mediaFileId: media.fileId,
		})
		.from(title)
		.leftJoin(titlePrice, eq(title.id, titlePrice.titleId))
		.leftJoin(media, eq(title.mediaRef, media.id))
		.where(eq(title.id, id))

	if (!row) return null

	// Fetch file keys for preview
	const fileIds = [row.posterFileId, row.bannerFileId, row.mediaFileId].filter(Boolean) as string[]
	let fileMap: Record<string, string> = {}
	if (fileIds.length > 0) {
		const files = await db
			.select({ id: file.id, fileKey: file.fileKey })
			.from(file)
			.where(or(...fileIds.map((id) => eq(file.id, id))))
		fileMap = files.reduce((acc, f) => ({ ...acc, [f.id]: f.fileKey }), {})
	}

	const [genres, cast, seasons] = await Promise.all([
		db
			.select({
				id: titleGenre.genreId,
			})
			.from(titleGenre)
			.where(eq(titleGenre.titleId, id)),
		db
			.select({
				peopleId: titlePeople.peopleId,
				role: titlePeople.role,
			})
			.from(titlePeople)
			.where(eq(titlePeople.titleId, id)),
		db
			.select({
				id: season.id,
				seasonNum: season.seasonNum,
				releaseDate: season.releaseDate,
			})
			.from(season)
			.where(eq(season.titleId, id)),
	])

	const seasonIds = seasons.map((s) => s.id)
	const episodes = seasonIds.length
		? await db
				.select({
					id: episode.id,
					seasonId: episode.seasonId,
					episodeNum: episode.episodeNum,
					name: episode.name,
					description: episode.description,
					releaseDate: episode.releaseDate,
					mediaId: episode.mediaId,
				})
				.from(episode)
				.where(inArray(episode.seasonId, seasonIds))
		: []

	const episodeMediaIds = episodes.map((e) => e.mediaId).filter(Boolean)
	let episodeFileMap: Record<string, string> = {}
	let episodeFileIdMap: Record<string, string> = {}
	if (episodeMediaIds.length) {
		const mediaFiles = await db
			.select({ mediaId: media.id, fileId: media.fileId, fileKey: file.fileKey })
			.from(media)
			.innerJoin(file, eq(media.fileId, file.id))
			.where(inArray(media.id, episodeMediaIds))
		episodeFileMap = mediaFiles.reduce((acc, m) => ({ ...acc, [m.fileId]: m.fileKey }), {})
		episodeFileIdMap = mediaFiles.reduce((acc, m) => ({ ...acc, [m.mediaId]: m.fileId }), {})
	}

	const previewUrls: Record<string, string> = {}
	// Add main files
	for (const [fileId, fileKey] of Object.entries(fileMap)) {
		previewUrls[fileId] = await getPresignedUrl(fileKey)
	}
	// Add episode files
	for (const [fileId, fileKey] of Object.entries(episodeFileMap)) {
		if (!previewUrls[fileId]) {
			previewUrls[fileId] = await getPresignedUrl(fileKey)
		}
	}

	return {
		...row,
		genres: genres.map((g) => g.id),
		cast,
		seasons: seasons.map((s) => ({
			id: s.id,
			seasonNum: s.seasonNum,
			releaseDate: s.releaseDate,
			episodes: episodes
				.filter((e) => e.seasonId === s.id)
				.map((e) => ({
					id: e.id,
					episodeNum: e.episodeNum,
					name: e.name,
					description: e.description || undefined,
					releaseDate: e.releaseDate,
					movieFileId: episodeFileIdMap[e.mediaId] || e.mediaId,
				})),
		})),
		previewUrls,
	}
}

export const createProduct = async (
	data: {
		name: string
		slug: string
		releaseDate: string
		type: "MOVIE" | "SERIES"
		price?: string
		posterFileId?: string
		bannerFileId?: string
		movieFileId?: string
		seasons?: {
			seasonNum: number
			releaseDate: string
			episodes?: {
				episodeNum: number
				name: string
				description?: string
				releaseDate: string
				movieFileId: string
			}[]
		}[]
		genres?: string[]
		cast?: { peopleId: string; role: string }[]
	},
	createdBy: string,
) => {
	try {
		if (data.type === "MOVIE" && !data.movieFileId) {
			return { status: 400, message: "Movie file is required" }
		}

		const mediaId = data.movieFileId ? await createMediaRecord(data.movieFileId, createdBy) : null

		const [newTitle] = await db
			.insert(title)
			.values({
				name: data.name,
				slug: data.slug,
				type: data.type,
				releaseDate: data.releaseDate,
				imagePosterId: data.posterFileId ?? undefined,
				imageBannerId: data.bannerFileId ?? undefined,
				mediaRef: mediaId ?? undefined,
			})
			.returning({ id: title.id })

		if (data.price) {
			await db.insert(titlePrice).values({
				titleId: newTitle.id,
				price: data.price,
				startDate: new Date(),
			})
		}

		if (data.type === "SERIES" && data.seasons?.length) {
			for (const s of data.seasons) {
				const [newSeason] = await db
					.insert(season)
					.values({
						titleId: newTitle.id,
						seasonNum: s.seasonNum,
						releaseDate: s.releaseDate,
					})
					.returning({ id: season.id })

				if (s.episodes?.length) {
					for (const e of s.episodes) {
						const mediaId = await createMediaRecord(e.movieFileId, createdBy)
						await db.insert(episode).values({
							seasonId: newSeason.id,
							episodeNum: e.episodeNum,
							name: e.name,
							description: e.description,
							releaseDate: e.releaseDate,
							mediaId,
						})
					}
				}
			}
		}

		if (data.genres?.length) {
			const genreRows = data.genres.map((genreId) => ({
				titleId: newTitle.id,
				genreId,
			}))
			await db.insert(titleGenre).values(genreRows)
		}

		if (data.cast?.length) {
			const castRows = data.cast.map((c) => ({
				titleId: newTitle.id,
				peopleId: c.peopleId,
				role: c.role,
			}))
			await db.insert(titlePeople).values(castRows)
		}

		return { status: 200 }
	} catch (e: any) {
		console.error("Failed to create product:", e)
		if (e.code === "23505" && e.constraint === "title_slug_unique") {
			return {
				status: 400,
				message: "Slug is already taken. Please try another.",
			}
		}
		return { status: 500, message: "Internal server error" }
	}
}

const createMediaRecord = async (fileId: string, createdBy: string) => {
	const [record] = await db
		.insert(media)
		.values({
			fileId,
			duration: 0,
			createdBy,
		})
		.returning({ id: media.id })
	return record.id
}

export const createFileRecord = async (data: {
	fileName: string
	fileKey: string
	resourceType: string
	addedBy: string
}) => {
	const [record] = await db
		.insert(file)
		.values({
			fileName: data.fileName,
			fileKey: data.fileKey,
			resourceType: data.resourceType,
			addedBy: data.addedBy,
		})
		.returning({
			id: file.id,
			fileKey: file.fileKey,
			fileName: file.fileName,
			resourceType: file.resourceType,
		})
	return record
}

export const uploadProductFile = async (data: { file: File; resourceType: string; addedBy: string }) => {
	const fileKey = `products/${crypto.randomUUID()}-${data.file.name}`
	await uploadToS3({
		file: data.file,
		fileKey,
	})

	return createFileRecord({
		fileName: data.file.name,
		fileKey,
		resourceType: data.resourceType,
		addedBy: data.addedBy,
	})
}

export const updateProduct = async (
	id: string,
	data: {
		name: string
		slug: string
		type: "MOVIE" | "SERIES"
		releaseDate: string
		price?: string
		posterFileId?: string
		bannerFileId?: string
		movieFileId?: string
		genres?: string[]
		cast?: { peopleId: string; role: string }[]
		seasons?: {
			id?: string
			seasonNum: number
			releaseDate: string
			episodes?: {
				id?: string
				episodeNum: number
				name: string
				description?: string
				releaseDate: string
				movieFileId: string
			}[]
		}[]
	},
	updatedBy: string,
) => {
	try {
		const existing = await getProductById(id)
		if (!existing) {
			return { status: 404, message: "Product not found" }
		}

		let mediaId = existing.mediaId
		if (data.type === "MOVIE" && data.movieFileId && data.movieFileId !== existing.mediaFileId) {
			mediaId = await createMediaRecord(data.movieFileId, updatedBy)
		}

		await db
			.update(title)
			.set({
				name: data.name,
				slug: data.slug,
				type: data.type,
				releaseDate: data.releaseDate,
				imagePosterId: data.posterFileId ?? undefined,
				imageBannerId: data.bannerFileId ?? undefined,
				mediaRef: data.type === "MOVIE" ? (mediaId ?? undefined) : null,
			})
			.where(eq(title.id, id))

		if (data.price) {
			const activePrice = await db
				.select()
				.from(titlePrice)
				.where(and(eq(titlePrice.titleId, id), isNull(titlePrice.expiresDate)))
				.limit(1)

			const current = activePrice[0]

			// Only update if price changed
			if (!current || current.price !== data.price) {
				// Expire all current active ones (ensures only one is active)
				await db
					.update(titlePrice)
					.set({ expiresDate: new Date() })
					.where(and(eq(titlePrice.titleId, id), isNull(titlePrice.expiresDate)))

				// Insert new one
				await db.insert(titlePrice).values({
					titleId: id,
					price: data.price,
					startDate: new Date(),
				})
			}
		}

		// Sync Genres
		await db.delete(titleGenre).where(eq(titleGenre.titleId, id))
		if (data.genres?.length) {
			await db.insert(titleGenre).values(
				data.genres.map((genreId) => ({
					titleId: id,
					genreId,
				})),
			)
		}

		// Sync Cast
		await db.delete(titlePeople).where(eq(titlePeople.titleId, id))
		if (data.cast?.length) {
			await db.insert(titlePeople).values(
				data.cast.map((c) => ({
					titleId: id,
					peopleId: c.peopleId,
					role: c.role,
				})),
			)
		}

		// Sync Seasons & Episodes
		const existingSeasons = await db.select().from(season).where(eq(season.titleId, id))
		const existingSeasonIds = existingSeasons.map((s) => s.id)
		const existingEpisodes = existingSeasonIds.length
			? await db.select().from(episode).where(inArray(episode.seasonId, existingSeasonIds))
			: []

		const seasonIdMap: Record<string, string> = {}

		// 1. Upsert Seasons
		if (data.type === "SERIES" && data.seasons?.length) {
			for (const s of data.seasons) {
				let sId = s.id
				if (sId) {
					await db
						.update(season)
						.set({ seasonNum: s.seasonNum, releaseDate: s.releaseDate })
						.where(eq(season.id, sId))
				} else {
					const [newSeason] = await db
						.insert(season)
						.values({ titleId: id, seasonNum: s.seasonNum, releaseDate: s.releaseDate })
						.returning({ id: season.id })
					sId = newSeason.id
				}
				seasonIdMap[s.seasonNum] = sId!
			}
		}

		// 2. Upsert Episodes
		if (data.type === "SERIES" && data.seasons?.length) {
			for (const s of data.seasons) {
				const sId = seasonIdMap[s.seasonNum]
				if (s.episodes?.length) {
					for (const e of s.episodes) {
						if (e.id) {
							const ex = existingEpisodes.find((x) => x.id === e.id)
							let mediaId = ex?.mediaId

							if (mediaId) {
								const [m] = await db.select().from(media).where(eq(media.id, mediaId))
								if (!m || m.fileId !== e.movieFileId) {
									mediaId = await createMediaRecord(e.movieFileId, updatedBy)
								}
							} else {
								mediaId = await createMediaRecord(e.movieFileId, updatedBy)
							}

							await db
								.update(episode)
								.set({
									seasonId: sId,
									episodeNum: e.episodeNum,
									name: e.name,
									description: e.description,
									releaseDate: e.releaseDate,
									mediaId,
								})
								.where(eq(episode.id, e.id))
						} else {
							const mediaId = await createMediaRecord(e.movieFileId, updatedBy)
							await db.insert(episode).values({
								seasonId: sId!,
								episodeNum: e.episodeNum,
								name: e.name,
								description: e.description,
								releaseDate: e.releaseDate,
								mediaId,
							})
						}
					}
				}
			}
		}

		// 3. Delete Orphans
		const incomingSeasonIds = (data.seasons || []).map((s) => s.id).filter(Boolean) as string[]
		const incomingEpisodeIds = (data.seasons || [])
			.flatMap((s) => s.episodes || [])
			.map((e) => e.id)
			.filter(Boolean) as string[]

		// Delete removed episodes first
		const episodesToDelete = existingEpisodes.filter((e) => !incomingEpisodeIds.includes(e.id)).map((e) => e.id)
		if (episodesToDelete.length) {
			await db.delete(episode).where(inArray(episode.id, episodesToDelete))
		}

		// Delete removed seasons last
		const seasonsToDelete = existingSeasons.filter((s) => !incomingSeasonIds.includes(s.id)).map((s) => s.id)
		if (seasonsToDelete.length) {
			await db.delete(season).where(inArray(season.id, seasonsToDelete))
		}

		return { status: 200 }
	} catch (e: any) {
		console.error("Failed to update product:", e)
		if (e.code === "23505" && e.constraint === "title_slug_unique") {
			return {
				status: 400,
				message: "Slug is already taken. Please try another.",
			}
		}
		return { status: 500, message: "Internal server error" }
	}
}

export const deleteProduct = async (id: string) => {
	try {
		const existing = await getProductById(id)
		if (!existing) {
			return { status: 404, message: "Product not found" }
		}

		// Delete cart and purchase references before titlePrice (they FK to it too)
		await db.delete(cartItem).where(eq(cartItem.titleId, id))
		await db.delete(purchasementItem).where(eq(purchasementItem.titleId, id))
		await db.delete(userLibrary).where(eq(userLibrary.titleId, id))
		await db.delete(titleGenre).where(eq(titleGenre.titleId, id))
		await db.delete(titlePeople).where(eq(titlePeople.titleId, id))

		// Delete seasons + episodes
		const seasons = await db.select({ id: season.id }).from(season).where(eq(season.titleId, id))
		if (seasons.length) {
			await db.delete(episode).where(inArray(episode.seasonId, seasons.map((s) => s.id)))
			await db.delete(season).where(eq(season.titleId, id))
		}

		await db.delete(titlePrice).where(eq(titlePrice.titleId, id))
		await db.delete(title).where(eq(title.id, id))
		return { status: 200 }
	} catch (e: any) {
		console.error("Failed to delete product:", e)
		return { status: 500, message: "Internal server error" }
	}
}
