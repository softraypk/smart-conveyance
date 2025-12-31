import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "optional",
});

export const metadata: Metadata = {
    title: "Welcome To Smart Conveyance",
    description: "Welcome To Smart Conveyance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
        <head>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
                rel="stylesheet"
            />
            <title>Welcome To Smart Conveyance</title>
        </head>
        <body className="bg-background-light dark:bg-background-dark">
        {children}
        <Toaster />
        </body>
        </html>
    );
}
