const statusColors: Record<string, string> = {
    open: "bg-green-500",
    closed: "bg-red-500"
};
export default function Status({ status }: { status: string }) {
    return (
        <span className={`text-white px-2 py-1 rounded ${statusColors[status] || "bg-gray-500"}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}