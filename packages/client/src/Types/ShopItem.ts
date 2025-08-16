export type ShopItem = {
    id: number;
    name: string;
    currency: "USD" | "EUR" | "GBP" | "RUB" | "JPY" | "CNY" | "AUD" | "BRL" | "CAD" |
        "CZK" | "DKK" | "HKD" | "HUF" | "ILS" | "MYR" | "MXN" | "TWD" | "NZD" | "NOK" |
        "PHP" | "PLN" | "SGD" | "SEK" | "CHF" | "THB" | "TRY";
    disabled: boolean;
    price: number;
    quantity: number;
    description?: string;
    type: "credit" | "serverSlot";
};