import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "./user";
import type { User } from "../Types/User";
import type { Server } from "../Types/Server";
import type { Egg } from "@/Types/Egg";
import type { Nest } from "@/Types/Nest";
import type { Node } from "@/Types/Node";
import type { Product } from "@/Types/Product";
import type { UsefulLink } from "@/Types/UsefulLink";
import type { Ticket } from "@/Types/Ticket";
import type { PaymentServices } from "@/Types/PaymentServices";
import type { ShopItem } from "@/Types/ShopItem";
import type { Payment } from "@/Types/Payment";

const auth = getToken();
if(auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function useConfig() {
    return useQuery({
        queryKey: ["config"],
        queryFn: async () => {
            const res = await axios.get("/config");
            return res.data as {
                isSetupDone: boolean;
                rootUserExists: boolean;
                eggs: Egg[];
                nests: Nest[];
                nodes: Node[];
                usefulLinks: UsefulLink[];
                services: { name: PaymentServices; isProd: boolean }[];
            }
        }
    })
}

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        enabled: !!auth,
        queryFn: async () => {
            const res = await axios.get("/me");
            return res.data as {user: User, servers: (Server & {product: Product, nest:Nest})[]};
        }
    })
}

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        enabled: !!auth,
        queryFn: async () => {
            const res = await axios.get("/products");
            return res.data as Product[];
        }
    });
}

export function useAdminOverview() {
    return useQuery({
        queryKey: ["admin-overview"],
        enabled: !!auth,
        queryFn: async () => {
            const res = await axios.get("/admin/overview");
            return res.data as {
                totalUsers: number;
                totalServers: number;
                totalLocations: number;
            };
        }
    });
}

export function usePayments(limit: number) {
    return useInfiniteQuery({
        queryKey: ["payments", limit],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axios.get("/admin/payments", {
                params: {
                    limit,
                    offset: pageParam
                }
            });
            return res.data as Payment[];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < limit) return undefined;
            return allPages.flat().length;
        },
        initialPageParam: 0,
    });
}

export function useUsers(query?: string) {
    return useInfiniteQuery({
        queryKey: ["users", query],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axios.get("/users", {
                params: {
                    limit: 10,
                    offset: pageParam,
                    ...(query ? { query } : {})
                }
            });
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.flat().length;
        },
        initialPageParam: 0,
    });
}

export function useServers(query?: string) {
    return useInfiniteQuery({
        queryKey: ["servers", query],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axios.get("/servers", {
                params: {
                    limit: 10,
                    offset: pageParam,
                    ...(query ? { query } : {})
                }
            });
            return res.data as (Server & {user: User, product: Product})[];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.flat().length;
        },
        initialPageParam: 0,
    });
}

export function useTickets(query?: string) {
    return useInfiniteQuery({
        queryKey: ["tickets", query],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axios.get("/tickets", {
                params: {
                    limit: 10,
                    offset: pageParam,
                    ...(query ? { query } : {})
                }
            });
            return res.data as Ticket[];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.flat().length;
        },
        initialPageParam: 0,
    });
}

export function useTicket(id: number) {
    return useQuery({
        queryKey: ["ticket", id],
        queryFn: async () => {
            const res = await axios.get(`/tickets/${id}`);
            return res.data as Ticket;
        },
        enabled: !!id
    });
}

export function useTicketsAdmin(query?: string) {
    return useInfiniteQuery({
        queryKey: ["admin-tickets", query],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await axios.get("/admin/tickets", {
                params: {
                    limit: 10,
                    offset: pageParam,
                    ...(query ? { query } : {})
                }
            });
            return res.data as Ticket[];
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 10) return undefined;
            return allPages.flat().length;
        },
        initialPageParam: 0,
    });
}

export function useShop() {
    return useQuery<ShopItem[]>({
        queryKey: ["shop-items"],
        queryFn: async () => {
            const res = await axios.get("/shop/items");
            return res.data as ShopItem[];
        },
    });
}