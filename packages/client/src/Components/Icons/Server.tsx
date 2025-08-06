export default function ServerIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <rect x="3" y="5" width="18" height="6" rx="2" stroke="currentColor"/>
            <rect x="3" y="13" width="18" height="6" rx="2" stroke="currentColor"/>
            <circle cx="7" cy="8" r="1" fill="#e9a745"/>
            <circle cx="7" cy="16" r="1" fill="#e9a745"/>
            <line x1="10" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1"/>
            <line x1="10" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="1"/>
        </svg>
    );
}