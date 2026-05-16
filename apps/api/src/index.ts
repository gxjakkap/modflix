import { logger } from "@bogeychan/elysia-logger";
import cors from "@elysiajs/cors";
import { isAdminRole } from "@modflix/auth/helper";
import { Elysia } from "elysia";
import { betterAuth } from "./modules/auth";
import { adminModules } from "./modules/admin";

const PORT = Number(process.env.API_PORT) || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : true;

console.log("allowedOrigins: ", allowedOrigins)

const app = new Elysia({
  serve: {
    maxRequestBodySize: 1024 * 1024 * 1024 * 5,
  }
})
  .use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(logger())
  .use(betterAuth)
  .guard({ auth: true }, (app) =>
    app
      .onBeforeHandle(({ user, set }) => {
        if (!isAdminRole(user.role)) {
          set.status = 403;
          return { message: "Forbidden" };
        }
      })
      .use(adminModules),
  );

app.listen({
  port: PORT,
  idleTimeout: 255,
});

console.log(
  `ModFlix API is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
