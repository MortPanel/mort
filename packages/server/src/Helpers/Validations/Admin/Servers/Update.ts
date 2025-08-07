import z from "zod";

export const adminUpdateServerSchema = z.object({
    name: z.string()
        .trim()
        .min(3, "Server name must be between 3 and 255 characters")
        .max(255, "Server name must be between 3 and 255 characters"),
    description: z.string()
        .trim()
        .max(255, "Description must be at most 255 characters long").optional(),
    suspended: z.boolean().default(false),
});