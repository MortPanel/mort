import z from "zod";

export const createUsefulLinkSchema = z.object({
    title: z.string().min(2).max(255),
    url: z.string().min(5).max(255).refine((val) =>val.startsWith("http://") || val.startsWith("https://"), {
        message: "URL must start with http:// or https://"
    }),
    description: z.string().min(1).max(1000).trim(),
    positions: z.array(z.enum(["dashboard", "topbar"])).min(1)
});