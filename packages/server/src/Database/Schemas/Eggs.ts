import { mysqlTable, varchar, text, timestamp, json, int } from "drizzle-orm/mysql-core";
import { nestsTable } from "./Nests";

export const eggsTable = mysqlTable("eggs", {
    id: int("id").autoincrement().primaryKey(),
    nestId: int("nest_id").notNull().references(() => nestsTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    dockerImage: varchar("docker_image", { length: 255 }).notNull(),
    startup: text("startup").notNull(),
    environment: json("environment").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow()
});