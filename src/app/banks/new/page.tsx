"use client";

import Sidebar from "@/components/Sidebar";
import BankForm from "@/components/BankForm";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface Bank {
    name: string;
    address: string;
    code: string;
}

export default function NewBanksPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // ✅ Handle create bank (POST only)
    const handleSubmit = async (values: Bank) => {
        setLoading(true);
        try {
            const response = await api("/admins/banks", {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (response?.ok || response?.status === 200) {
                toast.success("Bank added successfully");
                router.push("/banks");
            } else {
                const message =
                    response?.results?.message || "Failed to add bank";
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center bg-white dark:bg-gray-900">
                <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] min-w-72">
                            Add New Bank
                        </p>
                    </div>

                    <div className="p-4">
                        <div
                            className="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                            <BankForm onSubmit={handleSubmit} loading={loading}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
