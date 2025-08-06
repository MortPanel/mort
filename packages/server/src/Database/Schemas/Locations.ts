import { mysqlTable, varchar, timestamp, text, int } from "drizzle-orm/mysql-core";

export const locationsTable = mysqlTable("locations", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});