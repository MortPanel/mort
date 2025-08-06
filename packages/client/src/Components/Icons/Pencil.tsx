export default function PencilIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <path
                d="M16.862 3.487a2.06 2.06 0 0 1 2.915 2.915l-1.06 1.06-2.915-2.915 1.06-1.06z"
                fill="#e9a745"
                stroke="currentColor"
            />
            <path
                d="M4 20l3.5-.5 9.5-9.5-3-3L4.5 16.5 4 20z"
                fill="none"
                stroke="currentColor"
            />
            <path
                d="M7.5 19.5l-3.5.5.5-3.5L16 6l3 3L7.5 19.5z"
                fill="#e9a745"
                stroke="currentColor"
            />
        </svg>
    );
}