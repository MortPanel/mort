import { getPermissions } from "@/utils/permissions";
import { useUsers, useUser } from "@/utils/queries";
import { useMemo, useState } from "react";
import type { User } from "@/Types/User";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import coinString from "@/utils/coin";
import PencilIcon from "@/Components/Icons/Pencil";
import { LogIn, UserIcon } from "lucide-react";
import { loginAsUser } from "@/utils/apiRequests";
import { login } from "@/utils/user";
import UpdateUserDialog from "@/Components/Dialogs/UpdateUser";

type SortKey = "name" | "email" | "credits" | "serverLimit" | "servers" | "suspended" | "createdAt" | "emailVerified" | "permissions";
type SortOrder = "asc" | "desc";

const columns: { key: SortKey | "actions", label: string, render?: (user: User) => React.ReactNode }[] = [
    {
        key: "name", label: "Name", render: (user) => (
            <a href={`${import.meta.env.VITE_PTERODACTYL_URL}/admin/users/view/${user.id}`} className="text-blue-500 text-lg hover:underline">
                {user.name}
            </a>
        )
    },
    { key: "email", label: "Email" },
    { key: "emailVerified", label: "Email Verified", render: u => u.emailVerified ? "Yes" : "No" },
    { key: "credits", label: "Credits", render: u => coinString(u.credits) },
    { key: "serverLimit", label: "Server Limit", render: u => u.serverLimit === 0 ? "∞" : u.serverLimit },
    { key: "servers", label: "Servers", render: u => u.servers || 0 },
    { key: "createdAt", label: "Created", render: u => new Date(u.createdAt!).toLocaleDateString() },
    { key: "actions", label: "Actions" }
];

export default function Users() {
    const user = useUser();
    const perms = getPermissions(user.data?.user.permissions || 0);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [entries, setEntries] = useState(10);

    const usersQuery = useUsers(search);
    const isLoading = usersQuery.isLoading;
    const hasNextPage = usersQuery.hasNextPage;

    const sortedUsers = useMemo(() => {
        const users = usersQuery.data?.pages.flat() || [];
        return [...users].sort((a: User, b: User) => {
            let aVal = a[sortKey], bVal = b[sortKey];
            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [usersQuery.data, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        setSortKey(key);
        setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    };

    const handleFetchNextPage = () => { if (hasNextPage) usersQuery.fetchNextPage() }

    const LoginAsUser = async (userId: number) => {
        const r = await loginAsUser(userId);
        if(!r?.data?.token)return;
        login(r.data.token);
        window.location.href = "/";
    };

    if (!perms.includes("*")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <UserIcon className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Users</h1>
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
                            placeholder="Search users..."
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
                                </tr>
                            ) : sortedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">No users found matching your criteria.</td>
                                </tr>
                            ) : (
                                sortedUsers.map((user, idx) => (
                                    <tr key={user.id}
                                        className={`border-t border-[#23272f] transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#20232a]" : "bg-[#23272f]"} hover:bg-[#282c34]`}>
                                        {columns.map(col => {
                                            if (col.key === "actions") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3 flex items-center">
                                                        <UpdateUserDialog user={user}>
                                                        <button className="bg-[#23272f] border border-[#e9a745] hover:bg-[#e9a745] hover:text-[#23272f] text-[#e9a745] px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150 mr-2">
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        </UpdateUserDialog>
                                                        <button
                                                            onClick={() => LoginAsUser(user.id)}
                                                            className="bg-[#23272f] border border-blue-500 hover:bg-blue-500 hover:text-[#23272f] text-blue-500 px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150">
                                                            <LogIn className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col.key} className="px-5 py-3">
                                                    {col.render ? col.render(user) : (user as User)[col.key]}
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
                        Showing {sortedUsers.length} users
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