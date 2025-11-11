"use client";

import Sidebar from "@/components/Sidebar";
import BrokerForm from "@/components/BrokerForm";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface Broker {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    branchId?: string;
    emails?: string[];
}

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

export default function EditBrokerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const brokerId = searchParams.get("id"); // ?id=123 for edit mode

    const [brokerData, setBrokerData] = useState<Broker | null>(null);
    const [loading, setLoading] = useState(false);

    // Load user safely from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem("user");
        }
    }, []);

    // ✅ Load existing broker when editing
    useEffect(() => {
        if (!brokerId) return;
        const fetchBroker = async () => {
            try {
                const orgId = localStorage.getItem("orgId");
                const response = await api(`/orgs/${user?.managedOrgId}/brokers`);
                const brokers = response?.results || response || [];
                const found = brokers.find((b: Broker) => String(b.id) === String(brokerId));
                if (found) setBrokerData(found);
                else toast.error("Broker not found");
            } catch (err) {
                toast.error("Failed to load broker data");
            }
        };
        fetchBroker();
    }, [brokerId]);

    // ✅ Submit (POST or PATCH based on mode)
    const handleSubmit = async (values: Broker) => {
        setLoading(true);
        try {
            const method = brokerId ? "PATCH" : "POST";
            const endpoint = brokerId
                ? `/orgs/${user?.managedOrgId}/brokers/${brokerId}`
                : `/orgs/${user?.managedOrgId}/brokers`;

            const res = await api(endpoint, {
                method,
                body: JSON.stringify(values),
            });

            if (res?.ok || res?.status === 200) {
                toast.success(brokerId ? "Broker updated successfully" : "Broker added successfully");
                router.push("/brokers");
            } else {
                toast.error(res?.results?.message || "Operation failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <Sidebar/>
            <main className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center bg-white dark:bg-gray-900">
                <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
                    <div className="flex flex-wrap justify-between gap-3 p-4">
                        <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                            {brokerId ? "Edit Broker" : "Add New Broker"}
                        </p>
                    </div>
                    <div className="p-4">
                        <div
                            className="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                            <BrokerForm
                                initialValues={brokerData || undefined}
                                onSubmit={handleSubmit}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
