"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboards", icon: "dashboard" },
    { name: "Cases", href: "/cases", icon: "folder" },
    { name: "Organization", href: "/organizations", icon: "business_center" },
    { name: "Documents", href: "/documents", icon: "description" },
    { name: "Users", href: "/users", icon: "contacts" },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Trustee Office", href: "/trustee", icon: "account_balance" },
    { name: "Banks", href: "/banks", icon: "account_balance" },
    { name: "Settings", href: "/settings", icon: "settings" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const renderLinks = (onClick?: () => void) => (
        <ul className="space-y-1">
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                return (
                    <li key={item.href}>
                        <button
                            onClick={() => {
                                router.push(item.href);
                                onClick?.();
                            }}
                            className={`flex items-center gap-3 w-full px-4 py-2 rounded transition-colors
                                ${
                                isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                            }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.name}
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {/* ================= Mobile Menu Button ================= */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open menu"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* ================= Desktop Sidebar ================= */}
            <nav className="hidden md:block flex-grow p-4">
                {renderLinks()}
            </nav>

            {/* ================= Overlay ================= */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ================= Mobile Drawer ================= */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64
                    bg-white dark:bg-card-dark
                    shadow-xl transform transition-transform duration-300 md:hidden
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Links */}
                <nav className="p-4">
                    {renderLinks(() => setOpen(false))}
                </nav>
            </aside>
        </>
    );
}