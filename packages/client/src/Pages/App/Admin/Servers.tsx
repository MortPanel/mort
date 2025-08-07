import { getPermissions } from "@/utils/permissions";
import { useUser, useServers } from "@/utils/queries";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import PencilIcon from "@/Components/Icons/Pencil";
import { ServerIcon, Trash2Icon } from "lucide-react";

import type { Server } from "@/Types/Server";
import type { User } from "@/Types/User";
import type { Product } from "@/Types/Product";
import UpdateServerDialog from "@/Components/Dialogs/UpdateServer";
import DeleteServerDialog from "@/Components/Dialogs/DeleteServer";

type SortKey = "name" | "userId" | "id" | "productId" | "suspended" | "createdAt";
type SortOrder = "asc" | "desc";

type apitype = Server & {
    user: User;
    product: Product;
};

const columns: { key: SortKey | "actions", label: string, render?: (server: apitype) => React.ReactNode }[] = [
    {
        key: "name", label: "Name", render: (server) => (
            <a href={`${import.meta.env.VITE_PTERODACTYL_URL}/server/${server.identifier}`} className="text-blue-500 text-lg hover:underline">
                {server.name}
            </a>
        )
    },
    { 
        key: "userId", 
        label: "User", 
        render: (server) => (
            <a href={`${import.meta.env.VITE_PTERODACTYL_URL}/admin/users/view/${server.user.id}`} className="text-blue-500 hover:underline">
                {server.user.name}
            </a>
        )
    },
    { 
        key: "id", 
        label: "Server ID"
    },
    { 
        key: "productId", 
        label: "Product", 
        render: server => server.product.name 
    },
    { 
        key: "suspended", 
        label: "Suspended", 
        render: server => server.suspended ? "Yes" : "No" 
    },
    { 
        key: "createdAt", 
        label: "Created", 
        render: server => new Date(server.createdAt).toLocaleDateString() 
    },
    { key: "actions", label: "Actions" }
];

export default function AdminServers() {
    const user = useUser();
    const perms = getPermissions(user.data?.user.permissions || 0);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [entries, setEntries] = useState(10);

    const serversQuery = useServers(search);
    const isLoading = serversQuery.isLoading;
    const hasNextPage = serversQuery.hasNextPage;

    const sortedServers = useMemo(() => {
        const servers = serversQuery.data?.pages.flat() || [];
        return [...servers].sort((a: apitype, b: apitype) => {
            let aVal: string | number | boolean | undefined, bVal: string | number | boolean | undefined 
            if (sortKey === "userId") {
                aVal = a.user.name.toLowerCase();
                bVal = b.user.name.toLowerCase();
            } else if (sortKey === "productId") {
                aVal = a.product.name.toLowerCase();
                bVal = b.product.name.toLowerCase();
            } else {
                aVal = a[sortKey] as string | number | boolean;
                bVal = b[sortKey] as string | number | boolean;
                if (typeof aVal === "string") aVal = aVal.toLowerCase();
                if (typeof bVal === "string") bVal = bVal.toLowerCase();
            }
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [serversQuery.data, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        setSortKey(key);
        setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    };

    const handleFetchNextPage = () => { if (hasNextPage) serversQuery.fetchNextPage() }

    if (!perms.includes("servers")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <ServerIcon className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Servers</h1>
                </div>
            </div>
            <div className="p-4 bg-[#23272f] rounded-lg shadow-lg mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-sm">Show</label>
                        <Select value={String(entries)} onValueChange={v => { setEntries(Number(v)); }}>
                            <SelectTrigger className="bg-[#23272f] border border-[#31343c] rounded max-h-6 text-white w-24 focus:outline-none focus:border-[#e9a745] transition">
                                <SelectValue placeholder="Entries" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#181A20] text-white border-0 rounded-lg shadow-lg p-1">
                                {[10, 25, 50, 100].map(n => (
                                    <SelectItem key={n} value={String(n)} className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black">{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm">entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Search servers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-[#23272f] border border-[#31343c] rounded px-3 py-1 text-white w-full md:w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto rounded-xl shadow-lg border border-[#23272f] bg-[#181b20]">
                    <table className="min-w-full rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-[#23272f50] text-[#e9a745]">
                                {columns.map(col =>
                                    <th key={col.key} className="px-5 py-3 text-left font-semibold">
                                        {col.key !== "actions" ? (
                                            <span className="cursor-pointer select-none flex items-center gap-1"
                                                onClick={() => col.key !== "actions" && handleSort(col.key as SortKey)}>
                                                {col.label} {sortKey === col.key && (sortOrder === "asc" ? "▲" : "▼")}
                                            </span>
                                        ) : col.label}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">Loading servers...</td>
                                </tr>
                            ) : sortedServers.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">No servers found matching your criteria.</td>
                                </tr>
                            ) : (
                                sortedServers.map((server, idx) => (
                                    <tr key={server.id}
                                        className={`border-t border-[#23272f] transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#20232a]" : "bg-[#23272f]"} hover:bg-[#282c34]`}>
                                        {columns.map(col => {
                                            if (col.key === "actions") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3 flex items-center">
                                                        <UpdateServerDialog server={server}>
                                                        <button className="bg-[#23272f] border border-[#e9a745] hover:bg-[#e9a745] hover:text-[#23272f] text-[#e9a745] px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150 mr-2">
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        </UpdateServerDialog>

                                                        <DeleteServerDialog server={server} admin={true}>
                                                        <button className="border border-red-500 hover:bg-red-600 text-red-500 hover:text-[#23272f] px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150">
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </button>
                                                        </DeleteServerDialog>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col.key} className="px-5 py-3">
                                                    {col.render ? col.render(server) : server[col.key] as string}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">
                        Showing {sortedServers.length} servers
                    </span>
                    <div className="flex gap-2">
                        {hasNextPage && (
                            <button
                                className="px-3 py-1 rounded bg-[#e9a745] text-black hover:bg-[#d4a32b] transition-colors"
                                onClick={handleFetchNextPage}
                            >
                                Load More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}