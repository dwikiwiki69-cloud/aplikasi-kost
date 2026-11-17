import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => ({
    message: "Kost Management API is running",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({ status: "ok" }))
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
