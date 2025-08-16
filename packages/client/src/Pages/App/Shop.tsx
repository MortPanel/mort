import { useShop } from "@/utils/queries";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DollarSign } from "lucide-react";
import StoreIcon from "@/Components/Icons/Store";
import type { ShopItem } from "@/Types/ShopItem";
import coinString from "@/utils/coin";
import CreateItemDialog from "@/Components/Dialogs/CreateShopItem";
import { buyShopItem } from "@/utils/apiRequests";

type SortKey = "name" | "price" | "quantity" | "type";
type SortOrder = "asc" | "desc";

const columns: { key: SortKey | "actions", label: string, render?: (item: ShopItem) => React.ReactNode }[] = [
    { key: "name", label: "Name" },
    { key: "type", label: "Description", render: (item) => {
        return(
            <div className="text-sm text-gray-400">
                {item.type === "credit" ? coinString(item.quantity) : item.quantity} {item.type === "credit" ? "Credits" : "Server Slot"}
            </div>
        )
    }},
    { key: "type", label: "Type", render: (item) => {
        return (
            <div className="text-sm text-gray-400">
                {coinString(item.price)} {item.currency}
            </div>
        )
    } },
    { key: "actions", label: "" }
];

export default function Shop({admin=false}: {admin?:boolean}) {
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [entries, setEntries] = useState(10);

    const shopItemsQuery = useShop();
    const isLoading = shopItemsQuery.isLoading;

    const sortedshopItems = useMemo(() => {
        const shopItems = shopItemsQuery.data?.flat() || [];
        return [...shopItems].sort((a: ShopItem, b: ShopItem) => {
            let aVal = a[sortKey], bVal = b[sortKey];
            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [shopItemsQuery.data, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        setSortKey(key);
        setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <StoreIcon className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Shop</h1>
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
                    {admin && (
                        <div className="flex items-center gap-4">
                            <CreateItemDialog>
                                <button className="bg-[#e9a745] text-black px-3 py-1 rounded-lg hover:bg-[#d4a32b] cursor-pointer transition-colors">
                                    Create Item
                                </button>
                            </CreateItemDialog>
                        </div>
                    )}
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
                            ) : sortedshopItems.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">No items found matching your criteria.</td>
                                </tr>
                            ) : (
                                sortedshopItems
                                .filter((item) => admin ? true : !item.disabled)
                                .map((item, idx) => (
                                    <tr key={item.id}
                                        className={`border-t border-[#23272f] transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#20232a]" : "bg-[#23272f]"} hover:bg-[#282c34]`}>
                                        {columns.map(col => {
                                            if (col.key === "actions") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3 flex items-center">
                                                            <button
                                                                onClick={async()=>{
                                                                    const r = await buyShopItem(item.id, "stripe");
                                                                    if (r.data.url) window.open(r.data.url, "_blank");
                                                                }}
                                                                className="bg-[#23272f] border border-green-500 hover:bg-green-500 hover:text-[#23272f] text-green-500 px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150">
                                                                <DollarSign className="w-5 h-5" />
                                                            </button>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col.key} className="px-5 py-3">
                                                    {col.render ? col.render(item) : (item as ShopItem)[col.key]}
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
                        Showing {sortedshopItems.length} items
                    </span>
                </div>
            </div>
        </div>
    );
}