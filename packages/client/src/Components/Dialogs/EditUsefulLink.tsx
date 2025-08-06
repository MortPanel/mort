import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { editUsefulLink } from "@/utils/apiRequests";
import type { APIError } from "@/Types/APIError";
import type { UsefulLink } from "@/Types/UsefulLink";

export default function EditUsefulLinkDialog({
    children,
    usefulLink,
}: {
    children: React.ReactNode,
    usefulLink: UsefulLink
}) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(usefulLink);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const click = async () => {
        const create = await editUsefulLink(
            usefulLink.id,
            formData.title,
            formData.url,
            formData.description,
            formData.positions
        );
        if (create.status === 200) {
            window.location.reload();
            return
        }

        setErrors(Object.fromEntries(Object.entries(create.data.errors as APIError).map(([field, { errors }]) => [
            field, errors.map(error => error.message).join(", ")
        ])));
    }

    useEffect(() => {
        if (open) {setFormData({
            id: usefulLink.id,
            title: usefulLink.title,
            url: usefulLink.url,
            description: usefulLink.description,
            positions: usefulLink.positions,
        });setErrors({})}
    }, [
        open,
        usefulLink.id,
        usefulLink.title,
        usefulLink.url,
        usefulLink.description,
        usefulLink.positions
    ]);

    useEffect(() => {
        setErrors({})
    }, [formData]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-xl bg-[#121316] text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl mb-4">
                    Editing a useful link
                </DialogTitle>

                <div className="space-y-4">
                    <div>
                        <h1 className="block text-sm font-medium mb-2">Title</h1>
                        {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>}
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>
                    <div>
                        <h1 className="block text-sm font-medium mb-2">URL</h1>
                        {errors.url && <p className="text-red-500 text-sm mb-2">{errors.url}</p>}
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border-2 border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>

                    <div>
                        <h1 className="block text-sm font-medium mb-2">Description</h1>
                        {errors.description && <p className="text-red-500 text-sm mb-2">{errors.description}</p>}
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 max-h-64 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        />
                    </div>

                    <div>
                        <h1 className="block text-sm font-medium mb-2">Positions</h1>
                        {errors.positions && <p className="text-red-500 text-sm mb-2">{errors.positions}</p>}
                        <select
                            multiple
                            value={formData.positions}
                            onChange={(e) => {
                                const options = Array.from(e.target.selectedOptions, option => option.value);
                                setFormData({ ...formData, positions: options });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                        >
                            <option value="topbar" className="bg-[#1e1f20] text-white hover:bg-[#232427] rounded-lg py-2 px-2">Topbar</option>
                            <option value="dashboard" className="bg-[#1e1f20] text-white hover:bg-[#232427] rounded-lg py-2 mt-1 px-2">Dashboard</option>
                        </select>
                    </div>

                    <button
                        disabled={
                            Object.values(errors).some(error => error && error.length > 0) ||
                            formData.title.length === 0 ||
                            formData.url.length === 0 ||
                            formData.description.length === 0 ||
                            formData.positions.length === 0
                        }
                        onClick={async () => {
                            setErrors({});
                            await click();
                        }}
                        className="w-full bg-[#e9a745] cursor-pointer text-black font-semibold disabled:hover:bg-[#e9a745] py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Edit
                    </button>

                </div>

            </DialogContent>
        </Dialog>
    )
}