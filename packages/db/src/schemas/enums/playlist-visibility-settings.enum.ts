import { pgEnum } from "drizzle-orm/pg-core"

export const playlistVisibilitySettings = pgEnum("playlist_visibility_settings", ["PRIVATE", "UNLISTED", "PUBLIC"])
