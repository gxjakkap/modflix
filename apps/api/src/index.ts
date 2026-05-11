import { logger } from "@bogeychan/elysia-logger"
import cors from "@elysiajs/cors"
import { isAdminRole } from "@modflix/auth/helper"
import { Elysia } from "elysia"
import { betterAuth } from "./modules/auth"
import { adminModules } from "./modules/admin"

const PORT = Number(process.env.API_PORT) || 3000

const app = new Elysia()
	.use(
		cors({
			origin: true,
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(logger())
	.use(betterAuth)
	.guard({ auth: true }, (app) =>
		app
			.onBeforeHandle(({ user, set }) => {
				if (!isAdminRole(user.role)) {
					set.status = 403
					return { message: "Forbidden" }
				}
			})
			.use(adminModules),
	)

app.listen(PORT)

console.log(`ModFlix API is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
