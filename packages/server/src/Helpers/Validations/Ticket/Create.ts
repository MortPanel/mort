import z from "zod";

export const createTicketSchema = z.object({
    title: z.string()
        .trim()
        .max(24, "Title must be at most 24 characters long"),
    message: z.string()
        .trim()
        .max(512, "Message must be at most 512 characters long"),
    category: z.enum(["general", "billing", "technical", "other"], {
        message: "Invalid category"
    }),
    priority: z.enum(["low", "medium", "high"], {
        message: "Invalid priority"
    }),
    serverId: z.number().int().optional(),
});