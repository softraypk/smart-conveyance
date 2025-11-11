"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
    {name: "Dashboard", href: "/dashboards"},
    {name: "Cases", href: "/cases"},
    {name: "Mortgage Applications", href: "/mortgages"},
    {name: "Documents", href: "/documents"},
    {name: "Reports", href: "/reports"},
];

export default function NavBro() {
    const pathname = usePathname();

    // Get top-level path segment
    const currentResource = `/${pathname.split("/")[1]}`;

    return (
        <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
                const itemResource = `/${item.href.split("/")[1]}`;
                const isActive = currentResource === itemResource;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm transition-colors border-b-2
              ${
                            isActive
                                ? "font-medium text-primary border-primary"
                                : "font-medium text-black/60 dark:text-white/60 hover:text-primary dark:hover:text-primary border-transparent"
                        }`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}
