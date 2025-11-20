interface BackButtonProps {
    onClick: () => void;
    position: string;
    buttonName: string;
}

// position-absolute start-0 ms-3 d-flex align-items-center gap-2

export default function BackButton({ onClick, position, buttonName }: BackButtonProps) {
    return (
        <button 
            className={`btn btn-light position-absolute d-flex align-items-center gap-2 top-3 ${position}`}
            onClick={onClick}
            style={{ 
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
            }}
        >
            {buttonName === 'Back' ? (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
            ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    <path d="M4 6.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                    <path d="M6.5 4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5z"/>
                </svg>
            )}
            {buttonName}
        </button>
    );
}
