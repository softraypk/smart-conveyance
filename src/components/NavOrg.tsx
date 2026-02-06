"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";

const navItems = [
    {name: "Dashboard", href: "/dashboards"},
    {name: "Cases", href: "/cases"},
    {name: "Mortgage Applications", href: "/mortgages"},
    {name: "Appointments", href: "/appointments"},
    {name: "Invoices", href: "/invoices"},
    {name: "Branches", href: "/branches"},
    {name: "Brokers", href: "/brokers"},
    {name: "User (Buyer/Seller)", href: "/users"},
    {name: "Staff", href: "/staff"},
];

export default function NavOrg() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Top-level segment matcher
    const currentResource = `/${pathname.split("/")[1]}`;

    return (
        <div className="flex items-center gap-4 relative">
            {/* ================= Mobile Menu Button ================= */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* ================= Desktop Nav ================= */}
            <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                    const itemResource = `/${item.href.split("/")[1]}`;
                    const isActive = currentResource === itemResource;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm transition-colors border-b-2 pb-1
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

            {/* ================= Mobile Overlay ================= */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* ================= Mobile Drawer ================= */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-card-dark
                shadow-xl transform transition-transform duration-300 md:hidden
                ${open ? "translate-x-0" : "-translate-x-full"}`}>

                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
                    {navItems.map((item) => {
                        const itemResource = `/${item.href.split("/")[1]}`;
                        const isActive = currentResource === itemResource;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`px-6 py-4 text-sm transition-colors
                                    ${
                                    isActive
                                        ? "font-bold text-primary bg-primary/10"
                                        : "font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
}