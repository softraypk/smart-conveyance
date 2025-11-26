"use client";

import {usePathname, useRouter} from "next/navigation";

const navItems = [
    {name: "Dashboard", href: "/dashboards", icon: "dashboard"},
    {name: "Cases", href: "/cases", icon: "folder"},
    {name: "Organization", href: "/organizations", icon: "business_center"},
    {name: "Documents", href: "/documents", icon: "description"},
    {name: "Users", href: "/users", icon: "contacts"},
    {name: "Reports", href: "/reports", icon: "bar_chart"},
    {name: "Trustee Office", href: "/trustee", icon: "account_balance"},
    {name: "Banks", href: "/banks", icon: "account_balance"},
    {name: "Settings", href: "/settings", icon: "settings"},
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav className="flex-grow p-4">
            <ul className="space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <li key={item.href}>
                            <button
                                onClick={() => router.push(item.href)}
                                className={`flex items-center gap-3 w-full px-4 py-2 rounded transition-colors cursor-pointer
                  ${
                                    isActive
                                        ? "bg-primary/10 text-primary dark:bg-primary/20 font-semibold"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                                }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                {item.name}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}