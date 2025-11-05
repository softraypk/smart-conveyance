import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "react-hot-toast";

export const metadata: Metadata = {
    title: "Welcome To Smart Conveyance",
    description: "Welcome To Smart Conveyance",
};

import Head from "next/head";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
                rel="stylesheet"
            />
        </head>
        <body className="bg-background-light dark:bg-background-dark">
        {/*font-display text-gray-800 dark:text-gray-200*/}
        {children}
        <Toaster
            position="top-center"
            toastOptions={{
                // Base style
                className: "",
                style: {
                    borderRadius: "12px",
                    background: "#1E293B", // dark blue-gray
                    color: "#fff",
                    fontSize: "0.95rem",
                    padding: "14px 16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
                // Success
                success: {
                    iconTheme: {
                        primary: "#22c55e",
                        secondary: "#1E293B",
                    },
                },
                // Error
                error: {
                    style: {
                        background: "#B91C1C",
                    },
                },
            }}
        />
        </body>
        </html>
    );
}