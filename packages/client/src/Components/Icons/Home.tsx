export default function HomeIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9 9 9v7.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5V12zM9 21v-6h6v6m-3-3h3"
            />
        </svg>
    );
}