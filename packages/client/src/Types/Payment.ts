import type { PaymentServices } from "./PaymentServices";
import type { User } from "./User";

export type Payment = {
    id: number;
    service: PaymentServices;
    userId: number;
    quantity: number;
    price: number;
    currency: string;
    productId: number;
    productName: string;
    productType: string;
    status: "completed";
    user: User;
    createdAt: Date;
    updatedAt: Date;
};