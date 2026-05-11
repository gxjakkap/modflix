import { z } from "zod"

export const Roles = {
	SUPER_ADMIN: "super_admin",
	ADMIN: "admin",
	USER: "user",
} as const

export type RoleKeys = (typeof Roles)[keyof typeof Roles]

export const RolesEnum = z.enum(Object.values(Roles) as [string, ...string[]])

export const AdminRolesEnum = z.enum([Roles.SUPER_ADMIN, Roles.ADMIN])

export const AdminRoles = [Roles.SUPER_ADMIN, Roles.ADMIN] as const
export type AdminRole = (typeof AdminRoles)[number]
export const isAdminRole = (role: unknown): role is AdminRole =>
	typeof role === "string" && AdminRoles.includes(role as AdminRole)
