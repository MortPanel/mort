import { boolean, int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { nodesTable } from "./Nodes";
import { eggsTable } from "./Eggs";

export const productsTable = mysqlTable("products", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 1024 }),
    disabled: boolean("disabled").default(false),
    memory: int("memory"),
    disk: int("disk").notNull().default(1000),
    cpu: int("cpu").notNull().default(100),
    swap: int("swap").notNull().default(64),
    io: int("io").notNull().default(500),
    databases: int("databases").notNull().default(1),
    backups: int("backups").notNull().default(1),
    price: int("price").notNull(), 
    allocation: int("allocation").notNull().default(0),
    minimumCredits: int("minimum_credits").notNull().default(0),
    serverLimit: int("server_limit"),
    billingCycle: varchar("billing_cycle", { 
        enum: ["hourly", "daily", "weekly", "monthly", "annually"],
        length: 20
     }).notNull().default("hourly"),
    oomKiller: boolean("oom_killer").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const nodeProductsTable = mysqlTable("node_products", {
    id: int("id").autoincrement().primaryKey(),
    nodeId: int("node_id")
        .notNull()
        .references(() => nodesTable.id, { onDelete: "cascade" }),
    productId: int("product_id")
        .notNull()
        .references(() => productsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const eggProductsTable = mysqlTable("egg_products", {
    id: int("id").autoincrement().primaryKey(),
    eggId: int("egg_id")
        .notNull()
        .references(() => eggsTable.id, { onDelete: "cascade" }),
    productId: int("product_id")
        .notNull()
        .references(() => productsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});