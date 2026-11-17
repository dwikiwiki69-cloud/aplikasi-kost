import { Elysia, t } from "elysia";
import { registerUserService } from "../services/users-services";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    const result = await registerUserService(body);

    if (!result.success) {
      set.status = 400;
      return {
        error: result.error,
      };
    }

    set.status = 200;
    return {
      data: result.data,
    };
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
  }
);
