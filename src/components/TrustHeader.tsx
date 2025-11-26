import {useEffect, useState} from "react";
import PageLoader from "@/components/PageLoader";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

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

    // const navItems = [
    //     {name: "Dashboards", href: "/dashboards"},
    //     {name: "Cases", href: "/cases"},
    //     {name: "Calendar", href: "/calendar"},
    //     {name: "Reports", href: "/reports"},
    //     {name: "Settings", href: "/settings"},
    // ];

    const pathname = usePathname();

    return (
        <header
            className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-8 py-4 bg-content-light dark:bg-content-dark">
            <nav className="flex items-center gap-8"></nav>
            {/*<nav className="flex items-center gap-8">*/}
            {/*    {navItems.map((item) => {*/}
            {/*        const isActive = pathname === item.href;*/}

            {/*        return (*/}
            {/*            <Link*/}
            {/*                key={item.href}*/}
            {/*                href={item.href}*/}
            {/*                className={*/}
            {/*                    isActive*/}
            {/*                        ? "text-sm font-bold text-primary"*/}
            {/*                        : "text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary"*/}
            {/*                }*/}
            {/*            >*/}
            {/*                {item.name}*/}
            {/*            </Link>*/}
            {/*        );*/}
            {/*    })}*/}
            {/*</nav>*/}

            <div
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4muTp0IZe0tdN61kFHlOwQd50oFfpaBkmjjFLF2iS_fzvBE-N5KUKmrXa9WU0JJwrsMD9KVQRG9I69Bvxz2TvmAyGXcd1ItAlqYe7uZmoHF1YKuD2R8576iQeFlqYHYhYXxXWonaUYAseNHAWTdmRlHN9fMXaR0DvPc_i8yGe85nLlqtZ5Gkxzolt8x1LjiCbbUALBPK2oUy3EVgsqwOUP-axrE39MyaIxBgqXrdVOcSgkEs1phfWJCfFLHR0EEwdBddLLk85N5r8")`,
                }}
            ></div>
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
        </header>
    );
}