import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { updateServer } from "@/utils/apiRequests";
import type { APIError } from "@/Types/APIError";
import type { Server } from "@/Types/Server";

export default function UpdateServerDialog({
    children,
    server
}: {
    children: React.ReactNode,
    server: Server
}) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [formData, setFormData] = useState({
        name: server.name,
        description: server.description || "",
        suspended: server.suspended
    });

    useEffect(() => {
        if (!open) return;
        setFormData({
            name: server.name,
            description: server.description || "",
            suspended: server.suspended
        })
    }, [open, server]);

    const up = async () => {
        const u = await updateServer(server.id, formData.name, formData.description, formData.suspended);
        if (u.status === 200) {
            window.location.reload();
            return;
        }
        setErrors(Object.fromEntries(Object.entries(u.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-xl bg-[#121316] text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl font-bold mb-4">
                    Update Server
                </DialogTitle>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        {errors?.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        {errors?.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 max-h-64 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Suspended</label>
                        {errors?.suspended && <p className="text-red-500 text-sm mt-1">{errors.suspended}</p>}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={formData.suspended}
                                onChange={() => setFormData({ ...formData, suspended: !formData.suspended })}
                                className="sr-only peer"
                            />
                            <div onClick={() => setFormData({ ...formData, suspended: !formData.suspended })} className="w-11 h-6 cursor-pointer bg-gray-600 rounded-full peer peer-checked:bg-green-500 transition-all relative">
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200 ${formData.suspended ? "translate-x-5" : ""}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={up}
                    disabled={!formData.name}
                    className="w-full bg-[#e9a745] cursor-pointer text-black font-semibold disabled:hover:bg-[#e9a745] py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Update Server
                </button>
            </DialogContent>
        </Dialog>
    )
}