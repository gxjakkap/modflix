import type { ChangeEvent, DragEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import LovModal from "../../components/lov-modal"
import Navbar from "../../components/navbar"
import { api } from "../../lib/api"
import styles from "./product-edit-page.module.css"

const TYPES = ["MOVIE", "SERIES"] as const

interface ProductEditPageProps {
	pic?: string
	username?: string
}

interface EpisodeDraft {
	id?: string
	episodeNum: string
	name: string
	description: string
	releaseDate: string
	movieFile: File | null
	currentFileId: string | null
}

interface SeasonDraft {
	id?: string
	seasonNum: string
	releaseDate: string
	episodes: EpisodeDraft[]
}

export default function ProductEditPage({ pic, username }: ProductEditPageProps) {
	const { code: id } = useParams<{ code: string }>()
	const navigate = useNavigate()

	const [draft, setDraft] = useState({
		name: "",
		slug: "",
		releaseDate: "",
		type: "",
	})
	const [price, setPrice] = useState("")
	const [posterFile, setPosterFile] = useState<File | null>(null)
	const [bannerFile, setBannerFile] = useState<File | null>(null)
	const [movieFile, setMovieFile] = useState<File | null>(null)
	const [seasonRows, setSeasonRows] = useState<SeasonDraft[]>([])
	const [errors, setErrors] = useState<Record<string, string | null>>({})
	const [saved, setSaved] = useState(false)
	const [saving, setSaving] = useState(false)
	const [loading, setLoading] = useState(true)

	// LoV state
	const [allGenres, setAllGenres] = useState<any[]>([])
	const [allPeople, setAllPeople] = useState<any[]>([])
	const [showGenreLov, setShowGenreLov] = useState(false)
	const [showPeopleLov, setShowPeopleLov] = useState(false)
	const [selectedGenres, setSelectedGenres] = useState<any[]>([])
	const [castRows, setCastRows] = useState<any[]>([])

	// Current file IDs from server
	const [currentPosterId, setCurrentPosterId] = useState<string | null>(null)
	const [currentBannerId, setCurrentBannerId] = useState<string | null>(null)
	const [currentMovieId, setCurrentMovieId] = useState<string | null>(null)
	const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

	useEffect(() => {
		if (!id) return

		setLoading(true)
		Promise.all([
			api.admin.products({ id }).get(),
			api.admin.genres.list.get({ query: { page: 1, limit: 1000 } }),
			api.admin.people.list.get({ query: { page: 1, limit: 1000 } }),
		]).then(([res, resGenres, resPeople]) => {
			setLoading(false)
			if (res.status === 200 && res.data) {
				const p = res.data as any
				setDraft({
					name: p.name,
					slug: p.slug,
					releaseDate: p.releaseDate,
					type: p.type,
				})
				setPrice(p.price || "")
				setCurrentPosterId(p.posterFileId || null)
				setCurrentBannerId(p.bannerFileId || null)
				setCurrentMovieId(p.mediaFileId || null)
				setPreviewUrls(p.previewUrls || {})
				setCastRows(
					(p.cast || []).map((c: any) => {
						const person = (resPeople.data?.data || []).find((px: any) => px.id === c.peopleId)
						return { peopleId: c.peopleId, name: person?.name || "Unknown", role: c.role }
					}),
				)
				setSelectedGenres(
					(p.genres || [])
						.map((gid: string) => {
							return (resGenres.data?.data || []).find((gx: any) => gx.id === gid)
						})
						.filter(Boolean),
				)
				setSeasonRows(
					(p.seasons || []).map((s: any) => ({
						id: s.id,
						seasonNum: String(s.seasonNum),
						releaseDate: s.releaseDate,
						episodes: (s.episodes || []).map((e: any) => ({
							id: e.id,
							episodeNum: String(e.episodeNum),
							name: e.name,
							description: e.description || "",
							releaseDate: e.releaseDate,
							movieFile: null,
							currentFileId: e.movieFileId,
						})),
					})),
				)
			}
			if (resGenres.data) setAllGenres(resGenres.data.data)
			if (resPeople.data) setAllPeople(resPeople.data.data)
		})
	}, [id])

	const typeValue = draft.type as (typeof TYPES)[number] | ""

	const canSubmit = useMemo(() => {
		if (saving || saved || loading) return false
		if (!draft.name.trim() || !draft.slug.trim() || !draft.releaseDate) return false
		if (!draft.type) return false
		if (price.trim() && isNaN(Number(price))) return false
		return true
	}, [draft, saving, saved, loading, price])

	const handleChange = (field: string, value: string) => {
		setErrors((prev) => ({ ...prev, [field]: null }))
		setDraft((prev) => ({ ...prev, [field]: value }))
	}

	const uploadFile = async (file: File, resourceType: "title-poster" | "title-banner" | "title-media") => {
		const formData = new FormData()
		formData.append("file", file)
		formData.append("resourceType", resourceType)

		const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/upload`, {
			method: "POST",
			body: formData,
			credentials: "include",
		})

		const payload = await res.json().catch(() => null)
		if (!res.ok) {
			const message =
				payload && typeof payload === "object" && "message" in payload ? String(payload.message) : "Upload failed"
			throw new Error(message)
		}
		return String(payload.id)
	}

	const handleSave = async () => {
		if (!id) return
		setSaving(true)
		try {
			const posterFileId = posterFile ? await uploadFile(posterFile, "title-poster") : currentPosterId || undefined
			const bannerFileId = bannerFile ? await uploadFile(bannerFile, "title-banner") : currentBannerId || undefined
			const movieFileId =
				draft.type === "MOVIE" && movieFile ? await uploadFile(movieFile, "title-media") : currentMovieId || undefined

			const processedSeasons = []
			if (draft.type === "SERIES") {
				for (const s of seasonRows) {
					const eps = []
					for (const e of s.episodes) {
						let mediaId = e.currentFileId
						if (e.movieFile) {
							mediaId = await uploadFile(e.movieFile, "title-media")
						}
						if (!mediaId) throw new Error(`Video file required for Season ${s.seasonNum} Ep ${e.episodeNum}`)
						eps.push({
							id: e.id,
							episodeNum: Number(e.episodeNum),
							name: e.name,
							description: e.description,
							releaseDate: e.releaseDate || s.releaseDate || draft.releaseDate,
							movieFileId: mediaId,
						})
					}
					processedSeasons.push({
						id: s.id,
						seasonNum: Number(s.seasonNum),
						releaseDate: s.releaseDate || draft.releaseDate,
						episodes: eps,
					})
				}
			}

			const payload = {
				name: draft.name.trim(),
				slug: draft.slug.trim(),
				releaseDate: draft.releaseDate,
				type: draft.type as "MOVIE" | "SERIES",
				price: price.trim() || undefined,
				posterFileId,
				bannerFileId,
				movieFileId,
				seasons: draft.type === "SERIES" ? processedSeasons : undefined,
				genres: selectedGenres.map((g) => g.id),
				cast: castRows.map((c) => ({ peopleId: c.peopleId, role: c.role })),
			}

			const res = await api.admin.products({ id }).put(payload)
			setSaving(false)
			if (res.status === 200) {
				setSaved(true)
				setTimeout(() => navigate("/products"), 800)
			} else {
				window.alert(`Error: ${(res.error?.value as any)?.message || "Failed to update"}`)
			}
		} catch (error) {
			setSaving(false)
			window.alert(`Error: ${error instanceof Error ? error.message : "Save failed"}`)
		}
	}

	const addSeason = () => {
		setSeasonRows((prev) => [...prev, { seasonNum: String(prev.length + 1), releaseDate: "", episodes: [] }])
	}

	const updateSeason = (idx: number, field: keyof SeasonDraft, value: any) => {
		setSeasonRows((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)))
	}

	const addEpisode = (sIdx: number) => {
		setSeasonRows((prev) =>
			prev.map((s, i) => {
				if (i !== sIdx) return s
				return {
					...s,
					episodes: [
						...s.episodes,
						{
							episodeNum: String(s.episodes.length + 1),
							name: "",
							description: "",
							releaseDate: s.releaseDate || draft.releaseDate,
							movieFile: null,
							currentFileId: null,
						},
					],
				}
			}),
		)
	}

	const updateEpisode = (sIdx: number, eIdx: number, field: keyof EpisodeDraft, value: any) => {
		setSeasonRows((prev) =>
			prev.map((s, i) => {
				if (i !== sIdx) return s
				return {
					...s,
					episodes: s.episodes.map((e, j) => (j === eIdx ? { ...e, [field]: value } : e)),
				}
			}),
		)
	}

	const removeEpisode = (sIdx: number, eIdx: number) => {
		setSeasonRows((prev) =>
			prev.map((s, i) => {
				if (i !== sIdx) return s
				return { ...s, episodes: s.episodes.filter((_, j) => j !== eIdx) }
			}),
		)
	}

	const updateCastRole = (idx: number, role: string) => {
		setCastRows((prev) => prev.map((c, i) => (i === idx ? { ...c, role } : c)))
	}

	const removeCastMember = (idx: number) => {
		setCastRows((prev) => prev.map((c, i) => (i === idx ? { ...c, _deleted: true } : c)).filter((_, i) => i !== idx))
	}

	if (loading) return <div className={styles.loading}>Loading...</div>

	return (
		<>
			<Navbar pic={pic} username={username} />
			<h1 className={styles.pageTitle}>Edit Product</h1>

			<div className={styles.pageWrapper}>
				<div className={styles.topSection}>
					<div className={styles.fieldsSection}>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>NAME *</label>
							<div className={styles.inputWrap}>
								<input
									className={styles.fieldInput}
									value={draft.name}
									onChange={(e) => handleChange("name", e.target.value)}
								/>
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>SLUG *</label>
							<div className={styles.inputWrap}>
								<input
									className={styles.fieldInput}
									value={draft.slug}
									onChange={(e) => handleChange("slug", e.target.value)}
								/>
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>RELEASE DATE *</label>
							<div className={styles.inputWrap}>
								<input
									type="date"
									className={styles.fieldInput}
									value={draft.releaseDate}
									onChange={(e) => handleChange("releaseDate", e.target.value)}
								/>
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>TYPE *</label>
							<div className={styles.inputWrap}>
								<select
									className={styles.fieldSelect}
									value={typeValue}
									onChange={(e) => handleChange("type", e.target.value)}
								>
									<option value="">—</option>
									{TYPES.map((t) => (
										<option key={t} value={t}>
											{t}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>POSTER</label>
							<div className={styles.fileAndPreview}>
								<input type="file" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
								{currentPosterId && !posterFile && previewUrls[currentPosterId] && (
									<img src={previewUrls[currentPosterId]} className={styles.previewImage} alt="Poster" />
								)}
							</div>
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>BANNER</label>
							<div className={styles.fileAndPreview}>
								<input type="file" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
								{currentBannerId && !bannerFile && previewUrls[currentBannerId] && (
									<img src={previewUrls[currentBannerId]} className={styles.previewImage} alt="Banner" />
								)}
							</div>
						</div>

						{draft.type === "MOVIE" && (
							<div className={styles.fieldRow}>
								<label className={styles.fieldLabel}>MOVIE FILE *</label>
								<div className={styles.fileAndPreview}>
									<input type="file" onChange={(e) => setMovieFile(e.target.files?.[0] || null)} />
									{currentMovieId && !movieFile && previewUrls[currentMovieId] && (
										<video src={previewUrls[currentMovieId]} className={styles.previewVideo} controls />
									)}
								</div>
							</div>
						)}

						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>PRICE</label>
							<input
								className={styles.fieldInput}
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>

						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>GENRES</label>
							<button className={styles.lovBtn} onClick={() => setShowGenreLov(true)}>
								{selectedGenres.length > 0 ? selectedGenres.map((g) => g.name).join(", ") : "Select Genres..."}
							</button>
						</div>

						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>CAST</label>
							<div className={styles.inputWrap}>
								<button className={styles.lovBtn} onClick={() => setShowPeopleLov(true)}>
									{castRows.length > 0 ? `${castRows.length} people selected` : "Select People..."}
								</button>
								{castRows.length > 0 && (
									<div className={styles.tableWrapper} style={{ marginTop: "15px" }}>
										<table className={styles.table}>
											<thead>
												<tr>
													<th>NAME</th>
													<th>ROLE</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												{castRows.map((c, idx) => (
													<tr key={idx}>
														<td>{c.name}</td>
														<td>
															<input
																className={styles.epInput}
																value={c.role}
																onChange={(e) => updateCastRole(idx, e.target.value)}
															/>
														</td>
														<td>
															<button className={styles.delBtn} onClick={() => removeCastMember(idx)}>
																×
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{draft.type === "SERIES" && (
					<div className={styles.seriesSection}>
						<div className={styles.sectionHeader}>
							<h2 className={styles.sectionTitle}>Seasons & Episodes</h2>
							<button className={styles.addBtn} onClick={addSeason}>
								+ Add Season
							</button>
						</div>

						{seasonRows.map((s, sIdx) => (
							<div key={sIdx} className={styles.seasonCard}>
								<div className={styles.seasonHeader}>
									<div className={styles.seasonMain}>
										<span>Season</span>
										<input
											className={styles.smallInput}
											value={s.seasonNum}
											onChange={(e) => updateSeason(sIdx, "seasonNum", e.target.value)}
										/>
										<span>Release Date</span>
										<input
											type="date"
											className={styles.fieldInput}
											value={s.releaseDate}
											onChange={(e) => updateSeason(sIdx, "releaseDate", e.target.value)}
										/>
									</div>
									<button className={styles.addEpBtn} onClick={() => addEpisode(sIdx)}>
										+ Add Episode
									</button>
								</div>

								<div className={styles.epList}>
									{s.episodes.map((e, eIdx) => (
										<div key={eIdx} className={styles.epRow}>
											<div className={styles.epMain}>
												<div className={styles.epTop}>
													<input
														placeholder="No."
														className={styles.tinyInput}
														value={e.episodeNum}
														onChange={(v) => updateEpisode(sIdx, eIdx, "episodeNum", v.target.value)}
													/>
													<input
														placeholder="Episode Name"
														className={styles.epNameInput}
														value={e.name}
														onChange={(v) => updateEpisode(sIdx, eIdx, "name", v.target.value)}
													/>
													<input
														type="date"
														className={styles.epDateInput}
														value={e.releaseDate}
														onChange={(v) => updateEpisode(sIdx, eIdx, "releaseDate", v.target.value)}
													/>
												</div>
												<textarea
													placeholder="Description"
													className={styles.epDesc}
													value={e.description}
													onChange={(v) => updateEpisode(sIdx, eIdx, "description", v.target.value)}
												/>
												<div className={styles.epFile}>
													<span>Video: </span>
													<input
														type="file"
														onChange={(v) =>
															updateEpisode(sIdx, eIdx, "movieFile", v.target.files?.[0] || null)
														}
													/>
													{e.currentFileId && !e.movieFile && previewUrls[e.currentFileId] && (
														<div className={styles.miniPreview}>
															<a href={previewUrls[e.currentFileId]} target="_blank" rel="noreferrer">
																Preview Current
															</a>
														</div>
													)}
												</div>
											</div>
											<button className={styles.delBtn} onClick={() => removeEpisode(sIdx, eIdx)}>
												×
											</button>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}

				<div className={styles.bottomBar}>
					<button className={styles.backBtn} onClick={() => navigate("/products")}>
						← Back
					</button>
					<button className={styles.saveBtn} onClick={handleSave} disabled={!canSubmit}>
						{saving ? "SAVING..." : saved ? "✓ SAVED!" : "SAVE CHANGES"}
					</button>
				</div>
			</div>

			<LovModal
				open={showGenreLov}
				data={allGenres}
				columns={[
					{ key: "name", label: "Name" },
					{ key: "slug", label: "Slug" },
				]}
				idKey="id"
				displayKey="name"
				title="Select Genres"
				onSelect={setSelectedGenres}
				onClose={() => setShowGenreLov(false)}
			/>

			<LovModal
				open={showPeopleLov}
				data={allPeople}
				columns={[
					{ key: "name", label: "Name" },
					{ key: "slug", label: "Slug" },
				]}
				idKey="id"
				displayKey="name"
				title="Select People"
				onSelect={(sel) =>
					setCastRows(sel.map((p) => ({ peopleId: p.id, name: p.name, role: "Actor" })))
				}
				onClose={() => setShowPeopleLov(false)}
			/>
		</>
	)
}
