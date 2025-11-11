"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Navbar from "@/components/Navbar";
import NavOrg from "@/components/NavOrg";
import NavBro from "@/components/NavBro";

interface User {
    name: string;
    email: string;
    role?: string; // Role determines layout type
}

export default function Sidebar() {
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    // ✅ Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    // ✅ If user is not loaded yet
    if (!user) {
        return (
            <>
            </>
        );
    }

    // ✅ ORG_ADMIN Layout
    if (user.role === "ORG_ADMIN") {
        return (
            <header
                className="bg-white dark:bg-background-dark/50 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left Section */}
                        <div onClick={() => router.push('/dashboards')}
                             className="flex items-center gap-4 cursor-pointer">
                            <div className="bg-primary p-2 rounded-lg text-white">
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    ></path>
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                Conveyancing System
                            </h1>
                        </div>

                        {/* Navigation */}
                        <NavOrg/>

                        {/* Right Section */}
                        <div className="flex items-center gap-4 relative">
                            {/* Notification */}
                            <button
                                className="relative flex items-center justify-center size-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                            </button>

                            {/* Profile Avatar */}
                            <div
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
                                style={{
                                    backgroundImage:
                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmhN1l05CxgMuAo3ADH3-0SZdBwsqv6ZM0MB2wtjS969Iz7bGZq6oV_S8GqwAG2m5o6SptHwPWEncFb7sv1K67KwL0AACX6kjJX8lig-0_HHeG54ewnWi899R-bxVZgf57t8CIaprWEB-zfcHoWipJS0_Uh4cB7CmB121Bk8jBSIvHox8f8SSsw8L2pSOfrkN5WCkv7gfgJ_NJxLACLzZ6nPOLmaY9iSSWpr_5FVLXtQa4MqQG_WfLRKjLyRtlrNL8BU0AXo2Rf-cg')",
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
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // ✅ BRO_ADMIN Layout
    if (user.role === "MORTGAGE_BROKER" || user.role === "BROKER") {
        return (
            <header
                className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-16 py-4">
                <div
                    onClick={() => router.push('/dashboards')}
                    className="flex items-center gap-4 text-black dark:text-white cursor-pointer">
                    <div className="h-8 w-8 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_6_535)">
                                <path
                                    clipRule="evenodd"
                                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                ></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_6_535">
                                    <rect fill="white" height="48" width="48"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold">Smart Conveyancing</h2>
                </div>

                <div className="flex items-center gap-6">
                    <NavBro/>

                    <div className="flex items-center gap-4">
                        <button
                            className="rounded-full p-2 text-black/60 dark:text-white/60 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>

                        <div
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="h-10 w-10 rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDB25GJbKn0dQzeb5mUKFqrQ_ts3yKEDamQbDtB2o0bRoJ_MbEaMlH0rhZnfLdRYEXbsDIwVlhQ2Hmq5wbmK-j0bK418hRwe2sCSr9oO482yhW9_6fUAuzk6dJAivFMpLQKLH7x8GROzaBe-cAD03O5WT9XNqHtXJlTzaLV9xJvD8xlgIqMyJqSLzEYv83pgiXNMZPk6XEIPhxlfuLKRyNDfLq6YxShWtytwQf63jLeSmRZnawbonJ66020IbpSFuzpRExj1wb0syk_')",
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
                    </div>
                </div>
            </header>
        );
    }


    // ✅ Default Layout (non-admin users)
    return (
        <aside
            className="w-64 bg-background-light dark:bg-background-dark border-r border-gray-200 dark:border-gray-700 flex flex-col relative">
            {/* Logo Section */}
            <div onClick={() => router.push('/dashboards')}
                 className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer">
                <div className="w-8 h-8 text-primary">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_6_535)">
                            <path
                                clipRule="evenodd"
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_6_535">
                                <rect width="48" height="48" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Smart Conveyancing
                </h1>
            </div>

            {/* Main Navigation */}
            <Navbar/>

            {/* User Profile Section */}
            <div className="relative border-t border-gray-200 dark:border-gray-700">
                <div
                    className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div
                        className="w-10 h-10 rounded-full bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMmxFTmrBcDEd8NTTc9fqVlCbk_oJ--pDzaDNdvpioW4Xw8la7GmkOVqQJfq5k3kkDcrb-y9XRNgRQCpOp5PoFtgWIQQGVgQFamF0aR-4PVFDUq56_W2Hg_KDxkAzIWh4M5v5-j5aJpJkViGQufjgbhORVJAHobUPf7mIKd-o1iLEVJsnJkZts0Gr2D_BWL8uYnbJPf_ttCPuVXHWYWNrS44wsjax1D9ySroDITk8Bw_A7cAvVPBcbrEshMflPtb5q6aUB16WPxTmu')",
                        }}
                    ></div>
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-white">
                            {user.name}
                        </p>
                        <button
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push("/users/me");
                            }}
                        >
                            View Profile
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div
                        className="absolute bottom-16 left-4 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in">
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
