export default function TrashIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className={className}
        >
            <rect x="5" y="7" width="14" height="12" rx="2" stroke="currentColor" fill="none"/>
            <path d="M3 7h18" stroke="currentColor" strokeWidth={1.5} />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth={1.5} fill="none"/>
            <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth={1.5}/>
            <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth={1.5}/>
        </svg>
    );
}