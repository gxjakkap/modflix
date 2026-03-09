import { auth } from "@modflix/auth"
import { serverEnv } from "@modflix/env"
import { Elysia } from "elysia"

const PORT = serverEnv.API_PORT

const app = new Elysia().mount(auth.handler).listen(PORT)

console.log(`ModFlix API is running at ${app.server?.hostname}:${app.server?.port}`)

export type App = typeof app
