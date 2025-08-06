import z from "zod";

export const adminUpdateUserSchema = z.object({
    username: z.string()
        .min(3, "Username must be between 3 and 20 characters")
        .max(20, "Username must be between 3 and 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.email("Invalid email format")
        .max(255, "Email must be at most 255 characters long"),
    suspended: z.boolean().default(false),
    serverLimit: z.number().int().min(0, "Server limit must be at least 0"),
    permissions: z.number().int().min(0, "Permissions must be a positive integer").optional(),
    emailVerified: z.boolean().default(false).optional(),
});