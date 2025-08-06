import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import type { Server } from "@/Types/Server";
import { deleteServer } from "@/utils/apiRequests";

export default function DeleteServerDialog({
    children,
    server
}: {
    children: React.ReactNode,
    server: Server
}) {
    const [open, setOpen] = useState(false);
    const [serverName, setServerName] = useState("");
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="min-w-xl bg-[#121316] text-white rounded-lg p-6 border-0">
                <DialogTitle className="text-2xl mb-4">
                    Deleting <b>{server.name}</b>
                </DialogTitle>

                <p className="text-gray-400">
                    Are you sure you want to delete this server? This action cannot be undone.
                </p>
                <p className="text-gray-400">
                    Please type the server name <span className="font-bold">{server.name}</span> to confirm.
                </p>
                <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1e1f20] text-white border border-[#35363a] focus:outline-none focus:border-[#e9a745] transition"
                />

                <button
                    disabled={serverName !== server.name}
                    onClick={async () => {
                        const r = await deleteServer(server.id);
                        if(r.status === 200) window.location.reload();
                    }}
                    className="w-full bg-red-500 text-black font-semibold cursor-pointer py-2 px-4 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Delete Server
                </button>

            </DialogContent>
        </Dialog>
    )
}