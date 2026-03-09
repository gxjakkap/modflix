import { db } from "@modflix/db"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, username } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"
import * as dotenv from "dotenv"
import { resolve } from "path"

import { Roles } from "./roles"

dotenv.config({ path: resolve("../../.env") })

const statement = {
	...defaultStatements,
} as const

const ac = createAccessControl(statement)

const superAdminRole = ac.newRole({
	...adminAc.statements,
})

const adminRole = ac.newRole({
	...adminAc.statements,
})

const staffRole = ac.newRole({
	user: ["list"],
})

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username(),
		admin({
			ac,
			defaultRole: Roles.USER,
			adminRoles: [Roles.ADMIN, Roles.SUPER_ADMIN],
			roles: {
				[Roles.SUPER_ADMIN]: superAdminRole,
				[Roles.ADMIN]: adminRole,
				[Roles.STAFF]: staffRole,
			},
		}),
	],
	trustedOrigins: [
		process.env.API_CORS_ORIGIN || "http://localhost:3000",
	],
})
