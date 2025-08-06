import { int,mysqlTable,varchar,timestamp,text, json } from "drizzle-orm/mysql-core";
import { usersTable } from "./Users";

export const usefulLinksTable = mysqlTable("useful_links", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    url: varchar("url", { length: 255 }).notNull(),
    description: text("description").notNull(),
    positions: json("positions").notNull().$type<string[]>().default([]),
    createdBy: int("created_by")
        .notNull()
        .references(() => usersTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});