import { drizzle } from "drizzle-orm/mysql2";

export const db = drizzle({
    connection: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME!
    }
});
