import z from "zod";

export const registerSchema = z.object({
    username: z.string()
        .min(3, "Username must be between 3 and 20 characters")
        .max(20, "Username must be between 3 and 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.email("Email must be a valid email address"),
    password: z.string()
        .min(6, "Password must be between 6 and 30 characters")
        .max(30, "Password must be between 6 and 30 characters"),
    // isRoot & pterodactylId can only be set during initial setup and cannot be set by regular users
    isRoot: z.boolean().optional(),
    pterodactylId: z.number().optional()
});