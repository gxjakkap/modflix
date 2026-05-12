import Elysia from "elysia";
import { customersModules } from "./customers";
import { dashboardModules } from "./dashboard";
import { genresModules } from "./genres";
import { managementModules } from "./management";
import { productsModule } from "./products";
import { peopleModule } from "./people";
import { reportsModule } from "./reports";

export const adminModules = new Elysia({ prefix: "/admin" })
  .use(productsModule)
  .use(dashboardModules)
  .use(managementModules)
  .use(customersModules)
  .use(genresModules)
  .use(peopleModule)
  .use(reportsModule);
