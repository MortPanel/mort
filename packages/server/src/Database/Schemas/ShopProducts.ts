import { mysqlTable, varchar, int, boolean } from "drizzle-orm/mysql-core";

export const shopProductsTable = mysqlTable("shop_products", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    currency: varchar("currency", {
        length: 10,
        enum: [
            "USD", "EUR", "GBP", "RUB", "JPY", "CNY", "AUD", "BRL", "CAD",
            "CZK", "DKK", "HKD", "HUF", "ILS", "MYR", "MXN", "TWD", "NZD", "NOK",
            "PHP", "PLN", "SGD", "SEK", "CHF", "THB", "TRY"
        ]
    }).notNull(),
    disabled: boolean("disabled").default(false).notNull(),
    price: int("price").notNull(),
    quantity: int("quantity").notNull().default(1),
    description: varchar("description", { length: 255 }),
    type: varchar("type", {
        enum: ["credit", "serverSlot"],
        length: 20
    }).notNull(),
});