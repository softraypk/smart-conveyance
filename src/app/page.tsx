"use client"

import {LoginForm} from "@/components/LoginForm";
import {Header} from "@/components/Header";
import PageLoader from "@/components/PageLoader";
import {useState} from "react";

export default function SessionsPage() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            {isLoading && <PageLoader/>}
            <main className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-background-dark/50 p-8 rounded-lg shadow-md">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome
                            back</h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Sign in to your account
                        </p>
                    </div>
                    <LoginForm setIsLoading={setIsLoading}/>
                </div>
            </main>
        </div>
    );
}