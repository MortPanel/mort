import { getPermissions } from "@/utils/permissions";
import { useConfig, useUser } from "@/utils/queries";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import PencilIcon from "@/Components/Icons/Pencil";
import TrashIcon from "@/Components/Icons/Trash";
import { Link } from "lucide-react";
import type { UsefulLink } from "@/Types/UsefulLink";
import CreateUsefulLinkDialog from "@/Components/Dialogs/CreateUsefulLink";
import EditUsefulLinkDialog from "@/Components/Dialogs/EditUsefulLink";
import { deleteUsefulLink } from "@/utils/apiRequests";


type SortKey = "title" | "url" | "description" | "positions";
type SortOrder = "asc" | "desc";

const columns: { key: SortKey | "actions", label: string, render?: (l: UsefulLink) => React.ReactNode }[] = [
    { key: "title", label: "Title" },
    { key: "url", label: "URL", render: l => <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{l.url}</a> },
    { key: "description", label: "Description" },
    { key: "positions", label: "Positions", render: l => l.positions.join(", ") },
    { key: "actions", label: "Actions" }
];

export default function UsefulLinks() {
    const user = useUser();
    const c = useConfig();
    const perms = getPermissions(user.data?.user.permissions || 0);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("title");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [entries, setEntries] = useState(10);
    const [page, setPage] = useState(1);

    const filteredUsefulLinks = useMemo(() => {
        let arr: UsefulLink[] = Array.isArray(c.data?.usefulLinks) ? (c.data.usefulLinks as UsefulLink[]) : [];
        if (search.trim()) arr = arr.filter(
            (l: UsefulLink) =>
            (l.title?.toLowerCase().includes(search.toLowerCase()) ||
                l.url?.toLowerCase().includes(search.toLowerCase()) ||
                (l.description || "").toLowerCase().includes(search.toLowerCase()))
        );
        arr = [...arr].sort((a: UsefulLink, b: UsefulLink) => {
            let aVal = a[sortKey], bVal = b[sortKey];
            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        return arr;
    }, [c.data?.usefulLinks, search, sortKey, sortOrder]);

    const totalPages = Math.ceil(filteredUsefulLinks.length / entries);
    const pagedUsefulLinks = filteredUsefulLinks.slice((page - 1) * entries, page * entries);

    const handleSort = (key: SortKey) => {
        setSortKey(key);
        setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    };

    if (!perms.includes("usefulLinks")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <Link className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Useful Links</h1>
                </div>
            </div>
            <div className="p-4 bg-[#23272f] rounded-lg shadow-lg mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <label className="text-sm">Show</label>
                        <Select value={String(entries)} onValueChange={v => { setEntries(Number(v)); setPage(1); }}>
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
                            placeholder="Search useful links..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            className="bg-[#23272f] border border-[#31343c] rounded px-3 py-1 text-white w-full md:w-64"
                        />
                        <CreateUsefulLinkDialog>
                            <button className="bg-[#e9a745] text-black px-3 py-1 rounded-lg hover:bg-[#d4a32b] cursor-pointer transition-colors">
                                Create Useful Link
                            </button>
                        </CreateUsefulLinkDialog>
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
                            {pagedUsefulLinks.map((usefulLink, idx) => {
                                const globalIdx = (page - 1) * entries + idx;
                                return (
                                    <tr key={globalIdx}
                                        className={`border-t border-[#23272f] transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#20232a]" : "bg-[#23272f]"} hover:bg-[#282c34]`}>
                                        {columns.map(col => {
                                            if (col.key === "actions") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3 flex items-center">
                                                        <EditUsefulLinkDialog usefulLink={usefulLink}>
                                                            <button className="bg-[#23272f] border border-[#e9a745] hover:bg-[#e9a745] hover:text-[#23272f] text-[#e9a745] px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150 mr-2">
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                        </EditUsefulLinkDialog>
                                                        <button
                                                            onClick={async () => {
                                                                const dr = await deleteUsefulLink(usefulLink.id);
                                                                if (dr.status === 200) window.location.reload();
                                                            }}
                                                            className="bg-[#23272f] border border-red-500 hover:bg-red-500 hover:text-white text-red-400 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-150">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col.key} className="px-5 py-3 truncate max-w-32">
                                                    {col.render
                                                        ? col.render(usefulLink)
                                                        : (() => {
                                                            const value = (usefulLink as UsefulLink)[col.key];
                                                            if (value instanceof Date) return value.toLocaleString();
                                                            return value as React.ReactNode;
                                                        })()
                                                    }
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            {pagedUsefulLinks.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">No useful links found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">
                        Showing {(page - 1) * entries + 1} to {Math.min(page * entries, filteredUsefulLinks.length)} of {filteredUsefulLinks.length} entries
                    </span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-[#23272f] border border-[#31343c] text-white disabled:opacity-50"
                            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                        <code className="px-2 text-lg mt-1">{page} / {totalPages || 1}</code>
                        <button className="px-3 py-1 rounded bg-[#23272f] border border-[#31343c] text-white disabled:opacity-50"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}