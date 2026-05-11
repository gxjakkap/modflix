export * from "better-auth/client"
export * from "better-auth/client/plugins"

export type ClientSideUser = {
	id: string
	email: string
	emailVerified: boolean
	name: string
	createdAt: Date
	updatedAt: Date
	image?: string | null
	role?: string | null
	username?: string | null
}
