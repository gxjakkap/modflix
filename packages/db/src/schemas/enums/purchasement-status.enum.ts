import { pgEnum } from "drizzle-orm/pg-core"

export const purchasementStatus = pgEnum("purchasement_status", ["PENDING", "SUCCESS", "FAILED"])
