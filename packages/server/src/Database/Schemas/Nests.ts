import { boolean, mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const nestsTable = mysqlTable("nests", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    disabled: boolean("disabled").default(false),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});