import { timestamp } from "drizzle-orm/cockroach-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const barangTable = pgTable("barang", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  namabarang: varchar({ length: 255 }).notNull(),
  stock: integer().default(0),
  harga: integer().notNull(),
  createdAt: timestamp().defaultNow(),
})