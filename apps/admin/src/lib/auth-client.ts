import { adminClient, usernameClient } from "@modflix/auth/better-auth-client"
import { createAuthClient } from "@modflix/auth/client"

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL ?? import.meta.env.VITE_API_URL

export const authClient = createAuthClient({
	baseURL,
	plugins: [usernameClient(), adminClient()],
})
