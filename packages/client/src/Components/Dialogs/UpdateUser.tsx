import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { updateUser } from "@/utils/apiRequests";
import type { User } from "@/Types/User";
import type { APIError } from "@/Types/APIError";

export default function UpdateUserDialog({
    children,
    user
}: {
    children: React.ReactNode,
    user: User
}) {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string> | null>(null);
    const [formData, setFormData] = useState({
        username: user.name,
        email: user.email,
        suspended: user.suspended,
        serverLimit: user.serverLimit,
        permissions: user.permissions,
        emailVerified: user.emailVerified || false, 
    });

    useEffect(() => {
        if (!open) return;
        setFormData({
            username: user.name,
            email: user.email,
            suspended: user.suspended,
            serverLimit: user.serverLimit,
            permissions: user.permissions,
            emailVerified: user.emailVerified || false, 
        })
    }, [open, user]);

    const up = async () => {
        const u = await updateUser(user.id, formData.username, formData.email, formData.suspended, formData.serverLimit, formData.permissions);
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
                <DialogTitle className="text-2xl font-bold mb-4">Create Server</DialogTitle>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        {errors?.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Server Limit</label>
                        {errors?.serverLimit && <p className="text-red-500 text-sm mt-1">{errors.serverLimit}</p>}
                        <input
                            type="number"
                            value={formData.serverLimit}
                            onChange={(e) => setFormData({ ...formData, serverLimit: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>
                </div>
                <button
                    onClick={up}
                    disabled={!formData.username || !formData.email || formData.serverLimit < 0}
                    className="w-full bg-[#e9a745] cursor-pointer text-black font-semibold disabled:hover:bg-[#e9a745] py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Update User
                </button>
            </DialogContent>
        </Dialog>
    )
}