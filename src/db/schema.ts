import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Base placeholder schema. Modul-modul tabel akan didefinisikan sesuai issue.md
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("tenant"), // admin, staff, tenant
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
