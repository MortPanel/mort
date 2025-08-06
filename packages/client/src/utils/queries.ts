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