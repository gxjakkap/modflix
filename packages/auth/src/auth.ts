import { db } from "@modflix/db"
import * as schema from "@modflix/db/schema"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, username } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access"
import { config } from "dotenv"

import { Roles } from "./roles"

config({ path: new URL("../../../../.env", import.meta.url) })

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

const isProd = process.env.NODE_ENV === "production"

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	baseURL: process.env.BETTER_AUTH_URL || process.env.API_URL || "http://localhost:3000",
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
			},
		}),
	],
	trustedOrigins: [
		process.env.API_URL || "http://localhost:3000",
		...(process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173", "http://localhost:5174"]),
		...(process.env.TRUSTED_ORIGINS?.split(",") || []),
	],
	advanced: {
		useSecureCookies: isProd,
		crossSubdomainCookies: isProd
			? {
				enabled: true,
				domain: ".guntxjakka.me",
			}
			: { enabled: false },
	},
})
