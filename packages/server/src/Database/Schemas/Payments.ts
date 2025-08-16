import { boolean, mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const paymentsTable = mysqlTable("payments", {
    id: int("id").autoincrement().primaryKey(),
    service: varchar("service", { length: 255 }).notNull(),
    sessionId: varchar("session_id", { length: 255 }).notNull(),
    userId: int("user_id").notNull(),
    quantity: int("quantity").notNull(),
    price: int("price").notNull(),
    currency: varchar("currency", { length: 10 }).notNull(),
    productId: int("product_id"),
    productName: varchar("product_name", { length: 255 }).notNull(),
    productType: varchar("product_type", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});