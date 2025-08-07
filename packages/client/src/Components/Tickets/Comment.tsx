import type { TicketComment } from "@/Types/Ticket";

export default function Comment({ comment }: { comment: TicketComment }) {
    return (
        <div className="bg-[#2a2e36] rounded-lg p-4 shadow-md transition-all hover:shadow-lg">
            <div className="flex items-start gap-3 mb-3">
                <img
                    src={comment.user.avatar}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{comment.user.name}</h4>
                        <p className="text-xs text-gray-400 font-medium">
                            {new Date(comment.createdAt).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <p className="text-white mt-2 whitespace-pre-wrap break-all">{comment.message}</p>
                </div>
            </div>
        </div>
    );
}