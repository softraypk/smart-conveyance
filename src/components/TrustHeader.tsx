import {useEffect, useState} from "react";
import PageLoader from "@/components/PageLoader";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import NavOrg from "@/components/NavOrg";

interface User {
    name: string;
    email: string;
    role?: string;
}

export function TrustHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const router = useRouter();

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    const navItems = [
        {name: "Dashboards", href: "/dashboards"},
        {name: "Cases", href: "/cases"},
        {name: "Calendar", href: "/calendar"},
        {name: "Reports", href: "/reports"},
        {name: "Settings", href: "/settings"},
    ];

    const pathname = usePathname();

    return (
        <header
            className="bg-white dark:bg-background-dark shadow-sm border-b border-border-light dark:border-border-dark sticky top-0 z-10"
        >
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 text-primary">
                            <svg
                                fill="none"
                                viewBox="0 0 48 48"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_6_535)">
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                        fill="currentColor"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_6_535">
                                        <rect width="48" height="48" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>

                        <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                            Smart Conveyancing
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? "text-sm font-bold text-primary"
                                            : "text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary"
                                    }
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-10 h-10 rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoc21etVdp1lCPhgc0c6PrBB4h2sVMF3AE47wKgktbde62TtmQj8-1sdzFmuiptAxNRQ8BmZzd1aegqo0_I1z0FR1Bnt_s-_tHPhxX_oI51VLdUX-fy4WUzR12WaA3MLqxZ6I-7TbJR_E6ENjI3xz5zgSHtsnXZTpQPNNEUnzSGztTc5oeZpZoZf1dGJ6cBnBiz-8sSW55kbOToPs8bOowVXPQHf_JmmqyQAVWiTcMVFfIpx8-2qLvs423CHOufI6bmcj-oqw-YX0B')",
                            }}
                        />
                    </div>
                </div>
                {/* Dropdown */}
                {menuOpen && (
                    <div
                        className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-fade-in">
                        <button
                            onClick={() => router.push("/users/me")}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}