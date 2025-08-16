import z from "zod";

export const createShopProductSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().max(255).optional(),
    price: z.number().min(0),
    quantity: z.int().min(1).default(1),
    type: z.enum(["credit", "serverSlot"]),
    currency: z.enum([
            "USD", "EUR", "GBP", "RUB", "JPY", "CNY", "AUD", "BRL", "CAD",
            "CZK", "DKK", "HKD", "HUF", "ILS", "MYR", "MXN", "TWD", "NZD", "NOK",
            "PHP", "PLN", "SGD", "SEK", "CHF", "THB", "TRY"
        ]
    ),
    disabled: z.boolean().default(false)
});