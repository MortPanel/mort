export const permissions = new Map<string, bigint>([
    ["*", BigInt(1 << 0)],
    ["products", BigInt(1 << 1)],
    ["users", BigInt(1 << 2)],
    ["usefulLinks", BigInt(1 << 3)],
    ["servers", BigInt(1 << 4)],
    ["tickets", BigInt(1 << 5)]
]);

export function getPermissions(userPermissions: number): string[] {
    if (!userPermissions || typeof userPermissions !== "number") return [];

    const result: string[] = [];
    for (const [permission, value] of permissions.entries()) {
        if (typeof value !== "bigint") continue;
        if ((BigInt(userPermissions) & value) === value) result.push(permission);
    }

    if (result.includes("*")) return Array.from(permissions.keys());
    return result;
}