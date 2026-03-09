import { clientEnv } from "@modflix/env/client"
import { createAuthClient } from "@modflix/auth/client"

export const authClient = createAuthClient({
	baseURL: clientEnv.VITE_BETTER_AUTH_URL,
})
