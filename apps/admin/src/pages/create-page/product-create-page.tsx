/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { ChangeEvent, DragEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import LovModal from "../../components/lov-modal"
import Navbar from "../../components/navbar"
import { api } from "../../lib/api"
import styles from "./product-create-page.module.css"

const TYPES = ["MOVIE", "SERIES"] as const

interface ProductCreatePageProps {
	pic?: string
	username?: string
}

interface EpisodeDraft {
	episodeNum: string
	name: string
	description: string
	releaseDate: string
	movieFile: File | null
}

interface SeasonDraft {
	seasonNum: string
	releaseDate: string
	episodes: EpisodeDraft[]
}

export default function ProductCreatePage({ pic, username }: ProductCreatePageProps) {
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
	const [_errors, setErrors] = useState<Record<string, string | null>>({})
	const [saved, setSaved] = useState(false)
	const [saving, setSaving] = useState(false)

	// LoV state
	const [allGenres, setAllGenres] = useState<any[]>([])
	const [allPeople, setAllPeople] = useState<any[]>([])
	const [showGenreLov, setShowGenreLov] = useState(false)
	const [showPeopleLov, setShowPeopleLov] = useState(false)
	const [selectedGenres, setSelectedGenres] = useState<any[]>([])
	const [castRows, setCastRows] = useState<any[]>([])

	useEffect(() => {
		api.admin.genres.list.get({ query: { page: 1, limit: 1000 } }).then((res) => {
			if (res.data) setAllGenres(res.data.data)
		})
		api.admin.people.list.get({ query: { page: 1, limit: 1000 } }).then((res) => {
			if (res.data) setAllPeople(res.data.data)
		})
	}, [])

	const typeValue = draft.type as (typeof TYPES)[number] | ""

	const canSubmit = useMemo(() => {
		if (saving || saved) return false
		if (!draft.name.trim() || !draft.slug.trim() || !draft.releaseDate) return false
		if (!draft.type) return false
		if (price.trim() && isNaN(Number(price))) return false
		if (draft.type === "MOVIE" && !movieFile) return false
		return true
	}, [draft, saving, saved, movieFile, price])

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
		setSaving(true)
		try {
			const posterFileId = posterFile ? await uploadFile(posterFile, "title-poster") : undefined
			const bannerFileId = bannerFile ? await uploadFile(bannerFile, "title-banner") : undefined
			const movieFileId = draft.type === "MOVIE" && movieFile ? await uploadFile(movieFile, "title-media") : undefined

			const processedSeasons = []
			if (draft.type === "SERIES") {
				for (const s of seasonRows) {
					const eps = []
					for (const e of s.episodes) {
						if (!e.movieFile) throw new Error(`Video file required for Season ${s.seasonNum} Ep ${e.episodeNum}`)
						const mediaId = await uploadFile(e.movieFile, "title-media")
						eps.push({
							episodeNum: Number(e.episodeNum),
							name: e.name,
							description: e.description,
							releaseDate: e.releaseDate || s.releaseDate || draft.releaseDate,
							movieFileId: mediaId,
						})
					}
					processedSeasons.push({
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

			const res = await api.admin.products.create.post(payload)
			setSaving(false)
			if (res.status === 200) {
				setSaved(true)
				setTimeout(() => navigate("/products"), 800)
			} else {
				window.alert(`Error: ${(res.error?.value as any)?.message || "Failed to create"}`)
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

	return (
		<>
			<Navbar pic={pic} username={username} />
			<h1 className={styles.pageTitle}>Create Product</h1>

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
							<input type="file" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
						</div>
						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>BANNER</label>
							<input type="file" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
						</div>

						{draft.type === "MOVIE" && (
							<div className={styles.fieldRow}>
								<label className={styles.fieldLabel}>MOVIE FILE *</label>
								<input type="file" onChange={(e) => setMovieFile(e.target.files?.[0] || null)} />
							</div>
						)}

						<div className={styles.fieldRow}>
							<label className={styles.fieldLabel}>PRICE</label>
							<input className={styles.fieldInput} value={price} onChange={(e) => setPrice(e.target.value)} />
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
														onChange={(v) => updateEpisode(sIdx, eIdx, "movieFile", v.target.files?.[0] || null)}
													/>
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
						{saving ? "SAVING..." : saved ? "✓ CREATED!" : "CREATE PRODUCT"}
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
				onSelect={(sel) => setCastRows(sel.map((p) => ({ peopleId: p.id, name: p.name, role: "Actor" })))}
				onClose={() => setShowPeopleLov(false)}
			/>
		</>
	)
}
