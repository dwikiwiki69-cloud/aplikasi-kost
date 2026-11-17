import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .get("/", () => ({
    message: "Kost Management API is running",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({ status: "ok" }))
  .use(usersRoute)
  .listen(3000);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
