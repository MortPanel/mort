export type UsefulLink = {
    id: number;
    title: string;
    url: string;
    description: string;
    positions: string[]; 
    createdAt?: Date;
    updatedAt?: Date;
};