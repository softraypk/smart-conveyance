"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
    { name: "Dashboard", href: "/dashboards" },
    { name: "Cases", href: "/cases" },
    { name: "Mortgage Applications", href: "/mortgages" },
    { name: "Invoices", href: "/invoices" },
    //{ name: "Documents", href: "/documents" },
    { name: "Reports", href: "/reports" },
];

export default function NavBro() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const currentResource = `/${pathname.split("/")[1]}`;

    return (
        <div className="relative flex items-center gap-4">
            {/* Mobile Button */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden p-2"
            >
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => {
                    const isActive = currentResource === `/${item.href.split("/")[1]}`;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm border-b-2 transition
                                ${
                                isActive
                                    ? "text-primary border-primary"
                                    : "text-black/60 hover:text-primary border-transparent"
                            }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile Drawer */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl
                transform transition-transform duration-300 md:hidden
                ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="font-bold">Menu</h2>
                    <button onClick={() => setOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex flex-col divide-y">
                    {navItems.map((item) => {
                        const isActive =
                            currentResource === `/${item.href.split("/")[1]}`;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`px-6 py-4
                                    ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-gray-700 hover:bg-gray-100"
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