import { mysqlTable, varchar, timestamp, int, boolean } from "drizzle-orm/mysql-core";
import { usersTable } from "./Users";
import { eggsTable } from "./Eggs";
import { locationsTable } from "./Locations";
import { productsTable } from "./Products";

export const serversTable = mysqlTable("servers", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    suspended: boolean("suspended").default(false).notNull(),
    identifier: varchar("identifier", { length: 255 }),
    pterodactylId: varchar("pterodactyl_id", { length: 255 }),
    userId: int("user_id").notNull().references(() => usersTable.id),
    eggId: int("egg_id").notNull().references(() => eggsTable.id),
    locationId: int("location_id").notNull().references(() => locationsTable.id),
    productId: int("product_id").notNull().references(() => productsTable.id),
    nextBilling: timestamp("next_billing"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});