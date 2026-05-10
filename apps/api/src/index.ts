import { logger } from "@bogeychan/elysia-logger"
import cors from "@elysiajs/cors"
import { serverEnv } from "@modflix/env"
import { Elysia } from "elysia"
import { betterAuth } from "@/modules/auth"

const PORT = serverEnv.API_PORT

const app = new Elysia()
	.use(
		cors({
			origin: true,
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(logger())
	.use(betterAuth)
	.listen(PORT)

console.log(`ModFlix API is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
