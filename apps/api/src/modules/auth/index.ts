import { auth } from "@modflix/auth"
import Elysia from "elysia"

export const authMacro = new Elysia({ name: "auth-macro" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const session = await auth.api.getSession({
				headers,
			})

			if (!session) return status(401)

			return {
				user: session.user,
				session: session.session,
			}
		},
	},
})

export const betterAuth = new Elysia({ name: "better-auth" }).use(authMacro).mount(auth.handler)
