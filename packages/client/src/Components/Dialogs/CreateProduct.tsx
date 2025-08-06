import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useConfig } from "@/utils/queries";
import type { APIError } from "@/Types/APIError";
import { CreateProduct } from "@/utils/apiRequests";

export default function CreateProductDialog({
    children
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);
    const config = useConfig();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: null as number | null,
        disabled: false,
        cpu: null as number | null,
        memory: null as number | null,
        disk: 1000,
        io: 500,
        swap: null as number | null,
        serverLimit: null as number | null,
        allocations: 0,
        databases: 1,
        backups: 1,
        oomKiller: false,
        minimumCredits: 0,
        nodeIds: [] as number[],
        eggIds: [] as number[]
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open) return;
        setFormData({
            name: "",
            description: "",
            price: null as number | null,
            disabled: false,
            cpu: null as number | null,
            memory: null as number | null,
            disk: 1000,
            io: 500,
            swap: null as number | null,
            serverLimit: null as number | null,
            allocations: 0,
            databases: 1,
            backups: 1,
            oomKiller: false,
            minimumCredits: 0,
            nodeIds: [] as number[],
            eggIds: [] as number[]
        })
    }, [open]);

    useEffect(() => {
        setErrors({})
    },[formData]);

    const click = async () => {
        const create = await CreateProduct(
            formData.name,
            formData.description,
            (formData.price! * 100)!,
            formData.memory!,
            formData.disk!,
            formData.cpu!,
            formData.swap!,
            formData.serverLimit!,
            formData.allocations,
            formData.databases,
            formData.backups,
            formData.io,
            formData.oomKiller,
            formData.nodeIds,
            formData.eggIds,
            (formData.minimumCredits! * 100)!
        );
        if (create.status === 201) {
            window.location.reload();
            return
        }

        setErrors(Object.fromEntries(Object.entries(create.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:min-w-[48rem] bg-[#121316] overflow-auto text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl font-bold mb-4">Create Product</DialogTitle>
                <div className="flex flex-col sm:flex-row gap-8 px-2 max-h-[60vh] w-full overflow-auto">
                    <div className="flex flex-col space-y-4 sm:w-1/2 sm:min-w-[20rem]">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Product Name</label>
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 max-h-64 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Price (hourly)</label>
                                    {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.price)}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                        placeholder="Enter product price"
                                    />

                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Minimum Credits</label>
                                    {errors.minimumCredits && <span className="text-red-500 text-sm">{errors.minimumCredits}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.minimumCredits)}
                                        onChange={(e) => setFormData({ ...formData, minimumCredits: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                        placeholder="Enter minimum credits"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Cpu</label>
                                    {errors.cpu && <span className="text-red-500 text-sm">{errors.cpu}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.cpu)}
                                        onChange={(e) => setFormData({ ...formData, cpu: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />

                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Disk</label>
                                    {errors.disk && <span className="text-red-500 text-sm">{errors.disk}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.disk)}
                                        onChange={(e) => setFormData({ ...formData, disk: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Memory</label>
                                    {errors.memory && <span className="text-red-500 text-sm">{errors.memory}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.memory)}
                                        onChange={(e) => setFormData({ ...formData, memory: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />

                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">IO</label>
                                    {errors.io && <span className="text-red-500 text-sm">{errors.io}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.io)}
                                        onChange={(e) => setFormData({ ...formData, io: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Swap</label>
                                    {errors.swap && <span className="text-red-500 text-sm">{errors.swap}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.swap)}
                                        onChange={(e) => setFormData({ ...formData, swap: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />

                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Server Limit</label>
                                    {errors.serverLimit && <span className="text-red-500 text-sm">{errors.serverLimit}</span>}
                                    <input
                                        type="number"
                                        value={formData.serverLimit === null ? "" : (String(formData.serverLimit) === "0" ? "" : formData.serverLimit)}
                                        onChange={(e) => setFormData({ ...formData, serverLimit: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Allocations</label>
                                    {errors.allocations && <span className="text-red-500 text-sm">{errors.allocations}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.allocations)}
                                        onChange={(e) => setFormData({ ...formData, allocations: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Databases</label>
                                    {errors.databases && <span className="text-red-500 text-sm">{errors.databases}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.databases)}
                                        onChange={(e) => setFormData({ ...formData, databases: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium mb-2">Backups</label>
                                    {errors.backups && <span className="text-red-500 text-sm">{errors.backups}</span>}
                                    <input
                                        type="number"
                                        value={String(formData.backups)}
                                        onChange={(e) => setFormData({ ...formData, backups: Number(e.target.value) })}
                                        className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={() => setFormData({ ...formData, oomKiller: !formData.oomKiller })}>
                                <div className="border border-[#35363a] rounded w-4 h-4 bg-[#1e1f20]">
                                    {formData.oomKiller ?
                                        <div className="w-4 h-4 bg-[#e9a745] rounded" />
                                        : null}
                                </div>
                                <label className="text-sm font-medium">OOM Killer</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4 sm:w-1/2 w-full sm:min-w-[20rem]">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nodes</label>
                            {errors.nodeIds && <span className="text-red-500 text-sm">{errors.nodeIds}</span>}
                            <select
                                multiple
                                value={formData.nodeIds.map(String)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nodeIds: Array.from(e.target.selectedOptions, option => Number(option.value))
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                            >
                                {config.data?.nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Eggs</label>
                            {errors.eggIds && <span className="text-red-500 text-sm">{errors.eggIds}</span>}
                            <select
                                multiple
                                value={formData.eggIds.map(String)}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        eggIds: Array.from(e.target.selectedOptions, option => Number(option.value))
                                    })
                                }
                                className="w-full px-3 py-2 h-full rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                            >
                                {config.data?.eggs.map((egg) => (
                                    <option key={egg.id} value={egg.id}>
                                        {egg.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <button
                    disabled={
                        Object.values(errors).some(error => error && error.length > 0) ||
                        !formData.name ||
                        !formData.description ||
                        formData.price === null ||
                        formData.memory === null ||
                        formData.disk === null ||
                        formData.cpu === null ||
                        formData.swap === null ||
                        formData.nodeIds.length === 0 ||
                        formData.eggIds.length === 0
                    }
                    onClick={click}
                    className="w-full bg-[#e9a745] text-black font-semibold cursor-pointer py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Product
                </button>
            </DialogContent>
        </Dialog>
    )
}