import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { file } from "./file"
import { purchasement } from "./purchasement"

export const payment = pgTable("payment", {
	id: uuid("id").primaryKey().defaultRandom(),
	purchasementId: uuid("purchasement_id")
		.notNull()
		.references(() => purchasement.id),
	receiptFileId: uuid("receipt_file_id").references(() => file.id),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
