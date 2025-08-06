import z from "zod";

export const createProductSchema = z.object({
    name: z.string()
        .max(255, "Product name must be at most 255 characters long")
        .min(1, "Product name must be at least 1 character long"),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters long")
        .optional(),
    price: z.number().positive("Price must be a positive number"),
    disabled: z.boolean().default(false),
    memory: z.number().int()
        .positive("Memory must be a positive integer"),
    disk: z.number().int()
        .positive("Disk must be a positive integer"),
    cpu: z.number().int()
        .positive("CPU must be a positive integer"),
    swap: z.number().int()
        .positive("Swap must be a positive integer"),
    serverLimit: z.number().int().optional().nullable(),
    allocations: z.number().int().min(0, "Allocations must be at least 0"),
    minimumCredits: z.number().int().min(0, "Minimum credits must be at least 0"),
    databases: z.number().int()
        .positive("Databases must be a positive integer"),
    backups: z.number().int()
        .positive("Backups must be a positive integer"),
    io: z.number().int()
        .positive("IO must be a positive integer"),
    oomKiller: z.boolean().default(false),
    nodeIds: z.array(z.number().int().positive("Node ID must be a positive integer"))
        .min(1, "At least one node must be selected"),
    eggIds: z.array(z.number().int().positive("Egg ID must be a positive integer"))
        .min(1, "At least one egg must be selected"),
});