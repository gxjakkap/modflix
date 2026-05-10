import Elysia from "elysia"
import { productsModule } from "./products"

export const adminModules = new Elysia({ prefix: "/admin" }).use(productsModule)
