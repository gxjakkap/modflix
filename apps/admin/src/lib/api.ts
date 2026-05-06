import { treaty } from "@elysia/eden"
import type { App } from "@modflix/api-types"

export const api = treaty<App>(import.meta.env.VITE_API_URL)
