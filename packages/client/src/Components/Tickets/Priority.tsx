const priorityColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500"
};
export default function Priority({ priority }: { priority: string }) {
    return (
        <span className={`text-white px-2 py-1 rounded ${priorityColors[priority] || "bg-gray-500"}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
}