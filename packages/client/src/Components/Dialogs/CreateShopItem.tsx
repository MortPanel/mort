import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import type { APIError } from "@/Types/APIError";
import { createShopItem } from "@/utils/apiRequests";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function CreateItemDialog({
    children
}: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        quantity: 1,
        type: "credit" as "credit" | "serverSlot",
        currency: "USD",
        disabled: false
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!open) return;
        setFormData({
            name: "",
            description: "",
            price: 0,
            quantity: 1,
            type: "credit" as "credit" | "serverSlot",
            currency: "USD",
            disabled: false
        })
    }, [open]);

    useEffect(() => {
        setErrors({})
    }, [formData]);

    const click = async () => {
        const create = await createShopItem(
            formData.name,
            formData.description,
            (formData.price)*100,
            (formData.type == "credit" ? formData.quantity*100 : formData.quantity),
            formData.type,
            formData.currency,
            formData.disabled
        );

        if (create.status === 201) {
            window.location.reload();
            return;
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
            <DialogContent className="sm:min-w-[20rem] bg-[#121316] overflow-auto text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl font-bold mb-4">Create Item</DialogTitle>
                <div className="flex flex-col space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Name
                            </label>
                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 max-h-64 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Price
                            </label>
                            {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter price"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Quantity
                            </label>
                            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
                            <input
                                type="number"
                                value={formData.quantity || ""}
                                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                                placeholder="Enter quantity"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Type
                            </label>
                            {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value as "credit" | "serverSlot" })}
                            >
                                <SelectTrigger className="bg-[#1e1f20] w-full text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1f20] text-white border border-[#35363a]">
                                    <SelectItem className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black" value="credit">Credit</SelectItem>
                                    <SelectItem className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black" value="serverSlot">Server Slot</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Currency
                            </label>
                            {errors.currency && <span className="text-red-500 text-sm">{errors.currency}</span>}
                            <Select
                                value={formData.currency}
                                onValueChange={(value) => setFormData({ ...formData, currency: value })}
                            >
                                <SelectTrigger className="bg-[#1e1f20] w-full text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e1f20] text-white border border-[#35363a] overflow-y-auto max-h-60">
                                    {[
                                        "USD", "EUR", "GBP", "RUB", "JPY", "CNY", "AUD", "BRL", "CAD",
                                        "CZK", "DKK", "HKD", "HUF", "ILS", "MYR", "MXN", "TWD", "NZD", "NOK",
                                        "PHP", "PLN", "SGD", "SEK", "CHF", "THB", "TRY"
                                    ].map(currency => (
                                        <SelectItem className="hover:bg-[#e9a745] hover:text-black focus:bg-[#e9a745] focus:text-black data-[state=checked]:bg-[#e9a745] data-[state=checked]:text-black !hover:text-black" key={currency} value={currency}>{currency}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </div>
                <button
                    disabled={
                        Object.values(errors).some(error => error && error.length > 0) ||
                        !formData.name ||
                        !formData.description ||
                        !formData.price ||
                        !formData.quantity ||
                        !formData.type ||
                        !formData.currency
                    }
                    onClick={click}
                    className="w-full bg-[#e9a745] text-black font-semibold cursor-pointer py-2 px-4 rounded-lg hover:bg-[#d8a63c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Item
                </button>
            </DialogContent>
        </Dialog>
    )
}