import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export type RegisterUserResult =
  | { success: true; data: string }
  | { success: false; error: string };

export async function registerUserService(
  input: RegisterUserInput
): Promise<RegisterUserResult> {
  // 1. Cek apakah email sudah terdaftar
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "Email sudah terdaftar",
    };
  }

  // 2. Hash password menggunakan bcrypt via Bun.password
  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan data user ke database
  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return {
    success: true,
    data: "OK",
  };
}
