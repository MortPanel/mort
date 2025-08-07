import z from "zod";

export const createTicketCommentSchema = z.object({
    message: z.string()
        .trim()
        .max(512, "Message must be at most 512 characters long")
});