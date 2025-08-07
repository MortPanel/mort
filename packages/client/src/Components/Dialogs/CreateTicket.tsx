import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useUser } from "@/utils/queries";
import { createTicket } from "@/utils/apiRequests";
import type { APIError } from "@/Types/APIError";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function CreateTicketDialog({
    children,
}: {
    children: React.ReactNode,
}) {
    const [open, setOpen] = useState(false);
    const user = useUser();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        priority: "low",
        category: "general",
        serverId: undefined as number | null | undefined,
    });

    const cticket = async () => {
        const response = await createTicket(formData.title, formData.message, formData.category, formData.priority, formData.serverId as number | undefined);

        if (response.status === 201) {
            window.location.href = `/tickets/${response.data.ticketId}`;
        } else setErrors(Object.fromEntries(Object.entries(response.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-xl bg-[#121316] text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl mb-4">
                    Creating a new ticket
                </DialogTitle>

                <div className="flex flex-col space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Title
                            </label>
                            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter ticket title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Message
                            </label>
                            {errors.message && <span className="text-red-500 text-sm">{errors.message}</span>}
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-3 py-2 max-h-64 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter ticket message"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Priority
                            </label>
                            {errors.priority && <span className="text-red-500 text-sm">{errors.priority}</span>}
                            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                                <SelectTrigger className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                    <SelectItem value="low" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">Low</SelectItem>
                                    <SelectItem value="medium" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">Medium</SelectItem>
                                    <SelectItem value="high" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Category
                            </label>
                            {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                    <SelectItem value="general" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">General</SelectItem>
                                    <SelectItem value="billing" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">Billing</SelectItem>
                                    <SelectItem value="technical" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">Technical</SelectItem>
                                    <SelectItem value="other" className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Server
                            </label>
                            {errors.serverId && <span className="text-red-500 text-sm">{errors.serverId}</span>}
                            <Select value={formData.serverId?.toString() || ""} onValueChange={(value) => setFormData({ ...formData, serverId: value ? parseInt(value) : null })}>
                                <SelectTrigger className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select server" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#181A20] text-white border-0 focus:border-[#e9a745] rounded-lg shadow-lg p-1">
                                    {user.data?.servers.map(server => (
                                        <SelectItem key={server.id} value={String(server.id)} className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black">{server.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <button
                        onClick={cticket}
                        disabled={!formData.title || !formData.message || !formData.category || !formData.priority}
                        className="w-full bg-[#e9a745] text-black font-semibold cursor-pointer py-2 px-4 rounded-lg hover:bg-[#d4a32b] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Ticket
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}