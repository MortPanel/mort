import Comment from "@/Components/Tickets/Comment";
import Priority from "@/Components/Tickets/Priority";
import Status from "@/Components/Tickets/Status";
import type { TicketComment } from "@/Types/Ticket";
import { changeTicketStatus, createTicketComment } from "@/utils/apiRequests";
import { useTicket } from "@/utils/queries";
import { MessageSquare, Ticket } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewTicket() {
    const { id } = useParams<{ id: string }>();
    const t = useTicket(parseInt(id!));
    const [comment, setComment] = useState<string>("");

    if (t.isLoading) return;
    if (t.isError) return;
    if (!t.data?.title) return;
    return (
        <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col-reverse sm:flex-row gap-4 sm:gap-8 text-white">
            <div className="w-full sm:w-3/4 flex flex-col">
                <div className="bg-[#23272f] rounded-lg shadow-lg mb-4 p-4">

                    <Comment key="main" comment={{
                        id: t.data.id,
                        message: t.data.message,
                        createdAt: t.data.createdAt,
                        user: {
                            id: t.data.userId,
                            name: t.data.user.name,
                            avatar: t.data.user.avatar
                        }
                    } as TicketComment} />
                </div>

                {t.data.comments && t.data.comments.length > 0 && (
                    <div className="p-4 bg-[#23272f] rounded-lg shadow-lg mb-4">
                        <div className="space-y-2">
                            {t.data.comments.map((comment) => (
                                <Comment key={comment.id} comment={comment} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-5 bg-[#23272f] rounded-lg shadow-lg">
                    <div className="flex items-center gap-3 mb-5">
                        <MessageSquare className="w-5 h-5 text-[#e9a745]" />
                        <h2 className="text-xl font-semibold">Add Comment</h2>
                    </div>
                    <div className="space-y-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 bg-[#2a2e36] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e9a745] min-h-[120px] text-white resize-none transition-all duration-200"
                            placeholder="Type your comment here..."
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={async () => {
                                    if (!comment.trim()) return;
                                    const r = await createTicketComment(t.data.id, comment);
                                    if (r.status === 201) {
                                        setComment("");
                                        t.refetch();
                                    }
                                }}
                                disabled={!comment.trim()}
                                className="bg-[#e9a745] disabled:opacity-50 disabled:hover:bg-[#e9a745] disabled:cursor-not-allowed cursor-pointer text-white font-semibold px-6 py-3 rounded-md hover:bg-yellow-500 transition-all duration-200 shadow-md flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Submit Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full sm:w-1/4 h-fit p-6 bg-[#212327] rounded-xl shadow-xl mb-4 flex flex-col gap-6">
                <div className="flex items-center gap-3 mb-4">
                    <Ticket className="w-7 h-7 text-[#e9a745]" />
                    <h1 className="text-2xl font-extrabold tracking-tight">Ticket #{t.data.id}</h1>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-400 uppercase tracking-wide">Title</label>
                        <p className="text-lg font-medium text-white truncate">{t.data.title}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</label>
                        <Status status={t.data.status} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Priority</label>
                        <Priority priority={t.data.priority} />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category</label>
                        <p className="text-sm text-white uppercase">
                            {t.data.category}
                        </p>
                    </div>

                    {t.data?.server && (
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Server</label>
                            <a href={`${import.meta.env.VITE_PTERODACTYL_URL}/server/${t.data.server.identifier}`} className="text-sm text-[#e9a745] hover:underline">
                                {t.data.server.name}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                        <img
                            src={t.data.user.avatar}
                            alt={t.data.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-white">{t.data.user.name}</span>
                    </div>

                    <div className="mt-4">
                        {t.data.status !== "closed" && (
                            <button onClick={async () => {
                                const r = await changeTicketStatus(t.data.id, "closed");
                                if (r.status === 200) {
                                    t.refetch();
                                }
                            }} className="bg-red-500 text-white cursor-pointer font-semibold px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200">
                                Close Ticket
                            </button>
                        )}

                        {t.data.status === "closed" && (
                            <button onClick={async () => {
                                const r = await changeTicketStatus(t.data.id, "open");
                                if (r.status === 200) {
                                    t.refetch();
                                }
                            }} className="bg-green-500 text-white cursor-pointer font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-200">
                                Reopen Ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}