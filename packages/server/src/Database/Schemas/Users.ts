import { int, mysqlTable, varchar, float, timestamp, boolean } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users", {
    id: int("id").primaryKey().autoincrement().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    suspended: boolean("suspended").default(false).notNull(),
    permissions: int("permissions").default(0).notNull(),
    rootUser: boolean("root_user").default(false).notNull(),
    credits: float("credits").default(0).notNull(),
    serverLimit: int("server_limit").default(1).notNull(),
    pterodactylId: int("pterodactyl_id"),
    emailVerifiedAt: timestamp("email_verified_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});