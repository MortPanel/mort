export default function ProductIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <rect x="4" y="8" width="16" height="10" rx="2" stroke="currentColor" fill="none"/>
            <rect x="3" y="6" width="18" height="4" rx="1" stroke="currentColor" fill="#e9a745" />
            <rect x="10" y="14" width="4" height="2" rx="1" fill="#e9a745" />
        </svg>
    );
}