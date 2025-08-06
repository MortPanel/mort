import ProductIcon from "@/Components/Icons/Product";
import { getPermissions } from "@/utils/permissions";
import { useProducts, useUser } from "@/utils/queries";
import { useMemo, useState } from "react";
import type { Product } from "@/Types/Product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import coinString from "@/utils/coin";
import PencilIcon from "@/Components/Icons/Pencil";
import TrashIcon from "@/Components/Icons/Trash";
import CreateProductDialog from "@/Components/Dialogs/CreateProduct";
import EditProductDialog from "@/Components/Dialogs/EditProduct";
import { deleteProduct, EditProduct } from "@/utils/apiRequests";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type SortKey = "name" | "price" | "memory" | "disk" | "cpu" | "swap" | "serverLimit" | "allocation" | "databases" | "backups" | "io" | "disabled";
type SortOrder = "asc" | "desc";

const columns: { key: SortKey | "actions", label: string, render?: (p: Product) => React.ReactNode }[] = [
    { key: "disabled", label: "Active", render: () => null },
    { key: "name", label: "Name" },
    { key: "price", label: "Price", render: p => coinString(p.price) },
    { key: "memory", label: "Memory" },
    { key: "disk", label: "Disk" },
    { key: "cpu", label: "CPU" },
    { key: "swap", label: "Swap" },
    { key: "serverLimit", label: "Server Limit", render: p => p.serverLimit ?? "∞" },
    { key: "allocation", label: "Allocation" },
    { key: "databases", label: "Databases" },
    { key: "backups", label: "Backups" },
    { key: "io", label: "IO" },
    { key: "actions", label: "Actions" }
];

export default function Products() {
    const user = useUser();
    const perms = getPermissions(user.data?.user.permissions || 0);
    const products = useProducts();
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [entries, setEntries] = useState(10);
    const [activeStates, setActiveStates] = useState<Record<number, boolean>>({});
    const [page, setPage] = useState(1);

    const filteredProducts = useMemo(() => {
        let arr: Product[] = Array.isArray(products?.data) ? products.data : [];
        if (search.trim()) arr = arr.filter(
            (p: Product) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description || "").toLowerCase().includes(search.toLowerCase())
        );
        arr = [...arr].sort((a: Product, b: Product) => {
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
    }, [products.data, search, sortKey, sortOrder]);

    const totalPages = Math.ceil(filteredProducts.length / entries);
    const pagedProducts = filteredProducts.slice((page - 1) * entries, page * entries);

    const handleSort = (key: SortKey) => {
        setSortKey(key);
        setSortOrder(sortKey === key && sortOrder === "asc" ? "desc" : "asc");
    };
    const qc = useQueryClient();

    const changeActiveState = (index: number, state: boolean) => {
        setActiveStates(prev => ({ ...prev, [index]: state }));

        const product = pagedProducts[index - (page - 1) * entries];
        if (!product) return;

        const updatedProduct: Product = {
            ...product,
            disabled: !state
        };

        EditProduct(updatedProduct.id, updatedProduct.name, updatedProduct.description || "", updatedProduct.price, updatedProduct.memory, updatedProduct.disk, updatedProduct.cpu, updatedProduct.swap, updatedProduct.serverLimit || null, updatedProduct.allocation, updatedProduct.databases, updatedProduct.backups, updatedProduct.io, updatedProduct.oomKiller || false, updatedProduct.nodeIds, updatedProduct.eggIds, updatedProduct.minimumCredits, updatedProduct.disabled || false)
    
        qc.setQueryData(["config"], (oldData: {products:Product[]}) => {
            if (!oldData) return oldData;
            const updatedProducts = oldData.products.map((p: Product) => {
                if (p.id === updatedProduct.id) {
                    return { ...p, disabled: !state };
                }
                return p;
            });
            return { ...oldData, products: updatedProducts };
        });
    }

    if (!perms.includes("products")) return null;
    return (
        <div className="px-8 py-8 text-white rounded-lg">
            <div className="flex items-center gap-4 mb-4 justify-between">
                <div className="flex items-center gap-4">
                    <ProductIcon className="w-8 h-8 text-[#e9a745]" />
                    <h1 className="text-2xl font-bold">Products</h1>
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
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="bg-[#23272f] border border-[#31343c] rounded px-3 py-1 text-white w-full md:w-64"
                    />
                    <CreateProductDialog>
                        <button className="bg-[#e9a745] text-black px-3 py-1 rounded-lg hover:bg-[#d4a32b] cursor-pointer transition-colors">
                            Create Product
                        </button>
                    </CreateProductDialog>
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
                            {pagedProducts.map((product, idx) => {
                                const globalIdx = (page - 1) * entries + idx;
                                const isActive = activeStates[globalIdx] !== undefined
                                    ? activeStates[globalIdx]
                                    : !product.disabled;
                                return (
                                    <tr key={globalIdx}
                                        className={`border-t border-[#23272f] transition-colors duration-150 ${idx % 2 === 0 ? "bg-[#20232a]" : "bg-[#23272f]"} hover:bg-[#282c34]`}>
                                        {columns.map(col => {
                                            if (col.key === "disabled") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3">
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <input type="checkbox" checked={isActive}
                                                                onChange={() => changeActiveState(globalIdx, !isActive)}
                                                                className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-all relative">
                                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${isActive ? "translate-x-5" : ""}`}></div>
                                                            </div>
                                                        </label>
                                                    </td>
                                                );
                                            }
                                            if (col.key === "actions") {
                                                return (
                                                    <td key={col.key} className="px-5 py-3 flex items-center">
                                                        <EditProductDialog product={{...product, price: product.price / 100}}>
                                                        <button className="bg-[#23272f] border border-[#e9a745] hover:bg-[#e9a745] hover:text-[#23272f] text-[#e9a745] px-2 py-2 cursor-pointer rounded-lg transition-colors duration-150 mr-2">
                                                            <PencilIcon className="w-4 h-4"/>
                                                        </button>
                                                        </EditProductDialog>
                                                        <button 
                                                        onClick={async () => {
                                                            const pr = await deleteProduct(product.id);
                                                            if (pr.status === 204) return window.location.reload();
                                                            toast.error(pr.data?.message);
                                                        }}
                                                        className="bg-[#23272f] border border-red-500 hover:bg-red-500 hover:text-white text-red-400 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-150">
                                                            <TrashIcon className="w-4 h-4"/>
                                                        </button>
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={col.key} className="px-5 py-3">
                                                    {col.render ? col.render(product) : (product as Product)[col.key]}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            {pagedProducts.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-8 text-gray-400 bg-[#20232a]">No products found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">
                        Showing {(page - 1) * entries + 1} to {Math.min(page * entries, filteredProducts.length)} of {filteredProducts.length} entries
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