export function Header() {
    return (
        <header className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center gap-3 text-primary">
                    <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_6_535)">
                            <path
                                clipRule="evenodd"
                                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                fill="currentColor"
                                fillRule="evenodd"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_6_535">
                                <rect fill="white" height="48" width="48"/>
                            </clipPath>
                        </defs>
                    </svg>

                    <h1 className="text-xl font-bold">Smart Conveyancing</h1>
                </div>
            </div>
        </header>
    )
}