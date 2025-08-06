import { eq } from "drizzle-orm";
import { usersTable } from "../../Database";
import { db } from "../../Database/db";
import map from "./map";

export function getPermissions(userPermissions: number) {
    if (
        !userPermissions ||
        typeof userPermissions !== "number"
    ) return [];

    const permissions: string[] = [];
    for (const [permission, value] of map.entries()) {
        if (typeof value !== "bigint") continue;
        if ((BigInt(userPermissions) & value) === value) permissions.push(permission);
    }

    if (permissions.includes("*")) return Array.from(map.keys());
    return permissions;
}

export default async function permissions(userId:number): Promise<string[]> {
    const users = await db.select().from(usersTable).where(
        eq(usersTable.id, userId)
    );
    const user = users[0];
    if (!user) return [];

    return getPermissions(user.permissions);
}