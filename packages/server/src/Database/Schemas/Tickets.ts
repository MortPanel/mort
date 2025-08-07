import { mysqlTable, varchar, timestamp, int } from "drizzle-orm/mysql-core";
import { usersTable } from "./Users";
import { serversTable } from "./Servers";

export const ticketsTable = mysqlTable("tickets", {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 24 }).notNull(),
    message: varchar("message", { length: 512 }).notNull(),
    category: varchar("category", { length: 24 }).notNull(),
    priority: varchar("priority", { length: 24 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("open"),
    userId: int("user_id").notNull().references(() => usersTable.id),
    serverId: int("server_id").references(() => serversTable.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const ticketCommentsTable = mysqlTable("ticket_comments", {
    id: int("id").autoincrement().primaryKey(),
    ticketId: int("ticket_id").notNull().references(() => ticketsTable.id),
    userId: int("user_id").notNull().references(() => usersTable.id),
    message: varchar("message", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow()
});