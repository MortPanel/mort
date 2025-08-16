export type User = {
    id: number,
    name: string,
    email: string,
    pterodactylId: number,
    suspended: boolean,
    permissions: number,
    credits: number, // cents
    serverLimit: number,
    servers?: number, 
    emailVerified?: boolean,
    avatar: string,
    createdAt: Date,
    updatedAt?: Date,
}