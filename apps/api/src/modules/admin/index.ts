import Elysia from "elysia"
import { customersModules } from "./customers"
import { dashboardModules } from "./dashboard"
import { managementModules } from "./management"
import { productsModule } from "./products"

export const adminModules = new Elysia({ prefix: "/admin" })
	.use(productsModule)
	.use(dashboardModules)
	.use(managementModules)
	.use(customersModules)
