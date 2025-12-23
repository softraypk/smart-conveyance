"use client";

import Sidebar from "@/components/Sidebar";
import BankForm from "@/components/BankForm";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import TrusteeOfficeForm from "@/components/TrusteeOfficeForm";

interface Trustee {
    name: string;
    address: string;
    mapLink: string;
}

export default function NewBanksPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // ✅ Handle create bank (POST only)
    const handleSubmit = async (values: Trustee) => {
        setLoading(true);
        try {
            const response = await api("/trusteeOffice", {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (response?.ok || response?.status === 200) {
                toast.success("Trustee office added successfully");
                router.push("/trustee");
            } else {
                const message =
                    response?.results?.message || "Failed to add Trustee office";
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
                            Add New Trustee Office
                        </p>
                    </div>

                    <div className="p-4">
                        <div
                            className="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                            <TrusteeOfficeForm onSubmit={handleSubmit} loading={loading}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
