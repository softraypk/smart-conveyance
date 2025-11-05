"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const navItems = [
    {name: "Dashboard", href: "/dashboards"},
    {name: "Cases", href: "/cases"},
    {name: "Branches", href: "/branches"},
    {name: "Brokers", href: "/brokers"},
    {name: "Staff", href: "/staff"},
];

export default function NavOrg() {
    const pathname = usePathname();

    // Extract current top-level resource segment (e.g. "/branches")
    const currentResource = `/${pathname.split("/")[1]}`;

    return (
        <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
                const itemResource = `/${item.href.split("/")[1]}`;
                const isActive = currentResource === itemResource;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm cursor-pointer transition-colors border-b-2
              ${
                            isActive
                                ? "font-bold text-primary border-primary"
                                : "font-medium text-gray-600 dark:text-gray-300 hover:text-primary border-transparent"
                        }`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}