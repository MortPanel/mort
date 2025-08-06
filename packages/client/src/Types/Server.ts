export type Server = {
    id: number;
    name: string;
    description?: string;
    suspended: boolean;
    identifier?: string;
    pterodactylId?: string;
    userId: number;
    eggId: number;
    locationId: number;
    productId: number;
    nextBilling?: Date;
    createdAt: Date;
    updatedAt: Date;
}