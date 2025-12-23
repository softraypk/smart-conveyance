"use client";

import Sidebar from "@/components/Sidebar";
import BankForm from "@/components/BankForm";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import TrusteeOfficeForm from "@/components/TrusteeOfficeForm";

interface Trustee {
    id?: string | number;
    name: string;
    address: string;
    mapLink: string;
}

export default function EditBankPage() {
    const router = useRouter();
    const {id} = useParams(); // ✅ bank ID from route: /banks/[id]/edit
    const [trustee, setTrusteeOffice] = useState<Trustee | null>(null);
    const [loading, setLoading] = useState(false);

    // ✅ Fetch bank by filtering from list
    useEffect(() => {
        if (id) {
            setLoading(true);
            api(`/trusteeOffice/${id}`, {method: "GET"})
                .then((res) => {
                    if (res?.ok || res?.status === 200) {
                        const truesteeOffice = res.results || res || [];
                        if (truesteeOffice) setTrusteeOffice(truesteeOffice);
                        else toast.error("Bank not found");
                    } else {
                        toast.error("Failed to fetch banks");
                    }
                })
                .catch(() => toast.error("Error fetching banks"))
                .finally(() => setLoading(false));
        }
    }, [id]);

    // ✅ PUT API for updating
    const handleSubmit = async (values: Trustee) => {
        setLoading(true);
        try {
            const response = await api(`/trusteeOffice/${id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });

            if (response?.ok || response?.status === 200) {
                toast.success("Trustee Office updated successfully");
                router.push("/trustee");
            } else {
                toast.error(response.results?.message || "Update failed");
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
                            Edit Trustee Office
                        </p>
                    </div>
                    <div className="p-4">
                        <div
                            className="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                            <TrusteeOfficeForm
                                initialData={trustee}
                                onSubmit={handleSubmit}
                                loading={loading}
                                isEditing={true}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}