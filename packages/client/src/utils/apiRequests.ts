import axios from "axios";
import { getToken } from "./user";

const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function CreateUser(email: string, username: string, password: string, isRoot: boolean = false, pterodactylId?: string) {
    return axios.post('/register', {
        email,
        username,
        password,
        isRoot,
        pterodactylId: pterodactylId ? Number(pterodactylId) : undefined
    });
}

export function Login(email: string, password: string) {
    return axios.post('/login', {
        email,
        password
    });
}

export function CreateProduct(
    name: string,
    description: string,
    price: number,
    memory: number,
    disk: number,
    cpu: number,
    swap: number,
    serverLimit: number | null,
    allocation: number,
    databases: number,
    backups: number,
    io: number,
    oomKiller: boolean | null,
    nodeIds: number[],
    eggIds: number[],
    minimumCredits: number = 0
) {
    return axios.post('/products', {
        name,
        description,
        price,
        memory,
        disk,
        cpu,
        swap,
        serverLimit,
        allocations: allocation,
        databases,
        backups,
        io,
        oomKiller,
        nodeIds,
        eggIds,
        minimumCredits
    });
}

export function EditProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    memory: number,
    disk: number,
    cpu: number,
    swap: number,
    serverLimit: number | null,
    allocation: number,
    databases: number,
    backups: number,
    io: number,
    oomKiller: boolean | null,
    nodeIds: number[],
    eggIds: number[],
    minimumCredits: number = 0,
    disabled?: boolean
) {
    return axios.put(`/products/${id}`, {
        name,
        description,
        price,
        memory,
        disk,
        cpu,
        swap,
        serverLimit,
        allocations: allocation,
        databases,
        backups,
        io,
        oomKiller,
        nodeIds,
        eggIds,
        minimumCredits,
        disabled
    });
}

export function findProducts(eggId?: number, nodeId?: number) {
    return axios.get('/findProducts', {
        params: {
            eggId,
            nodeId
        }
    });
}

export function createServer(
    name:string,
    eggId: number,
    nodeId: number,
    productId: number,
) {
    return axios.post('/servers', {
        name,
        eggId,
        nodeId,
        productId
    });
}

export function deleteServer(serverId: number) {
    return axios.delete(`/servers/${serverId}`);
}

export function createUsefulLink(
    title: string,
    url: string,
    description: string,
    positions: string[]
) {
    return axios.post('/useful-links', {
        title,
        url,
        description,
        positions
    });
}

export function editUsefulLink(
    id: number,
    title: string,
    url: string,
    description: string,
    positions: string[]
) {
    return axios.put(`/useful-links/${id}`, {
        title,
        url,
        description,
        positions
    });
}

export function deleteUsefulLink(id: number) {
    return axios.delete(`/useful-links/${id}`);
}