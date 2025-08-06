import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useConfig } from "@/utils/queries";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import type { Product } from "@/Types/Product";
import { createServer, findProducts } from "@/utils/apiRequests";
import { DatabaseIcon, HardDrive, MemoryStickIcon, MicrochipIcon } from "lucide-react";
import coinString from "@/utils/coin";

export default function CreateServerDialog({
    children
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const config = useConfig();
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        eggId: -1,
        nestId: -1,
        nodeId: -1,
        productId: -1
    });

    useEffect(() => {
        if (!open) return;
        setFormData({
            name: "",
            eggId: -1,
            nestId: -1,
            nodeId: -1,
            productId: -1
        })
    }, [open]);

    useEffect(() => {
        if (formData.eggId === -1 || formData.nodeId === -1) {
            setProducts([]);
            return;
        }

        findProducts(formData.eggId, formData.nodeId).then((response) => {
            if (response.data) setProducts(response.data);
        });
    }, [formData.eggId, formData.nodeId]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-xl bg-[#121316] text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl font-bold mb-4">Create Server</DialogTitle>
                { error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="space-y-4">
                    <div>
                        <h1 className="block text-sm font-medium mb-2">Server Name</h1>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                            placeholder="Enter server name"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <h1 className="block text-sm font-medium mb-2">Games/Software</h1>
                            <Select
                                value={formData.nestId === -1 ? "" : String(formData.nestId)}
                                onValueChange={(value) => setFormData({ ...formData, nestId: Number(value), eggId: -1, productId: -1, nodeId: -1 })}
                            >
                                <SelectTrigger className="w-full bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select a game/software" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                    {config.data?.nests
                                        .map((nest) => (
                                            <SelectItem key={nest.id} value={String(nest.id)} className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">
                                                {nest.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-1/2">
                            <h1 className="block text-sm font-medium mb-2">Specification</h1>
                            <Select
                                disabled={formData.nestId === -1}
                                value={formData.eggId === -1 ? "" : String(formData.eggId)}
                                onValueChange={(value) => setFormData({ ...formData, eggId: Number(value), productId: -1, nodeId: -1 })}
                            >
                                <SelectTrigger className="w-full bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder={formData.nestId === -1 ? "..." : "Select a specification"} />
                                </SelectTrigger>
                                <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                    {config.data?.eggs
                                        ?.filter(egg => egg.nestId === formData.nestId)
                                        .map((egg) => (
                                            <SelectItem
                                                key={egg.id}
                                                value={String(egg.id)}
                                                className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black"
                                            >
                                                {egg.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <h1 className="block text-sm font-medium mb-2">Location</h1>
                        <Select
                            value={formData.nodeId === -1 ? "" : String(formData.nodeId)}
                            onValueChange={(value) => setFormData({ ...formData, nodeId: Number(value) })}
                        >
                            <SelectTrigger className="w-full bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                <SelectValue placeholder={formData.nodeId === -1 ? "..." : "Select a location"} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                {config.data?.nodes.map((node) => (
                                    <SelectItem key={node.id} value={String(node.id)} className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">
                                        {node.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.nodeId !== -1 && (
                        <div>
                            <h1 className="block text-sm font-medium mb-2">Product</h1>
                            <div className="flex overflow-auto max-w-[calc(34rem)] px-2 py-2 gap-4" style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#35363a transparent',
                                msOverflowStyle: 'none',
                                WebkitOverflowScrolling: 'touch',
                                overflowY: 'hidden'
                            }}>
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`w-64 min-w-[16rem] max-h-min relative p-5 rounded-2xl cursor-pointer transition-all border shadow-lg flex flex-col gap-2
                                            ${
                                                formData.productId === product.id
                                                    ? 'bg-[#ffe9b0] text-black border-[#e9a745] ring-2 ring-[#e9a745]'
                                                    : 'bg-[#181a20] text-white border-[#232325] hover:shadow-xl hover:border-[#e9a745] hover:bg-[#232325]'
                                            }
                                        `}
                                        onClick={() => {
                                            setFormData({ ...formData, productId: product.id })
                                        }}
                                        style={{ transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-lg truncate">{product.name}</span>
                                            {formData.productId === product.id && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full bg-black/10 text-xs font-semibold border border-[#e9a745] text-black">Selected</span>
                                            )}
                                            {product.serverLimit !== null && (
                                                <div className="flex max-w-min text-xs bg-[#e9a745] text-black px-2 rounded-full">
                                                    {product.serverLength + "/" + product.serverLimit}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs opacity-80 mb-2 line-clamp-2">{product.description}</div>
                                        <div className="flex flex-col gap-1 text-sm mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="flex gap-1 items-center">
                                                    <MicrochipIcon className="w-4 h-4 text-[#e9a745]" />
                                                    {product.cpu} vCores
                                                </span>
                                                <span className="flex gap-1 items-center">
                                                    <MemoryStickIcon className="w-4 h-4 text-[#e9a745]" />
                                                    {product.memory} MB
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center">
                                                    <i className="fa-solid fa-hdd text-[#e9a745]" />
                                                    <HardDrive className="w-4 h-4 text-[#e9a745]" />
                                                     {product.disk} MB
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <DatabaseIcon className="w-4 h-4 text-[#e9a745]" />
                                                    {product.databases ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="font-bold text-base">
                                                {product.price ? `${coinString(product.price)} Credits / Hourly` : "Free"}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {(Array.isArray(products) && products.length === 0 )&& (
                                    <div className="flex items-center justify-center w-full h-24 text-gray-400">
                                        No products available for this specification and location.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <button
                        disabled={
                            formData.name.length === 0 ||
                            formData.eggId === -1 ||
                            formData.nestId === -1 ||
                            formData.nodeId === -1 ||
                            formData.productId === -1
                        }
                        onClick={async() => {
                            const r = await createServer(
                                formData.name,
                                formData.eggId,
                                formData.nodeId,
                                formData.productId
                            )
                            if (r.status === 201) {
                                setOpen(false);
                                window.location.reload();
                            } else {
                                setError(r.data.message || "An error occurred while creating the server.");
                            }
                        }}
                        className="w-full bg-[#e9a745] cursor-pointer text-black font-semibold disabled:hover:bg-[#e9a745] py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Server
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}