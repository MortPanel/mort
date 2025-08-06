import { boolean, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { locationsTable } from "./Locations";

export const nodesTable = mysqlTable("nodes", {
    id: int("id").autoincrement().primaryKey(),
    locationId: int("location_id").notNull().references(() => locationsTable.id),
    disabled: boolean("disabled").default(false),
    name: varchar("name", { length: 255 }),
    description: varchar("description", { length: 1024 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});