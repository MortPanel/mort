export type Product = {
    id: number;
    name: string;
    description?: string;
    price: number;
    disabled?: boolean;
    memory: number;
    disk: number;
    cpu: number;
    swap: number;
    serverLimit?: number;
    allocation: number;
    databases: number;
    backups: number;
    io: number;
    oomKiller?: boolean;
    nodeIds: number[];
    eggIds: number[];
    minimumCredits: number;
    serverLength?: number;
}