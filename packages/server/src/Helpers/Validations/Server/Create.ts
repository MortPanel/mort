import z from "zod";

export const createServerSchema = z.object({
    name: z.string()
        .max(255, "Server name must be at most 255 characters long")
        .min(1, "Server name must be at least 1 character long"),
    eggId: z.number().int()
        .positive("Egg ID must be a positive integer"),
    nodeId: z.number().int()
        .positive("Node ID must be a positive integer"),
    productId: z.number().int()
        .positive("Product ID must be a positive integer")
});