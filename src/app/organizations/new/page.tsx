"use client";

import Sidebar from "@/components/Sidebar";
import {useEffect} from "react";
import OrgForm from "@/components/OrgForm";

export default function NewPage() {

    useEffect(() => {
        const payload = {
            name: "",
            legalName: "",
            reraNumber: "",
            tradeLicenseNo: "",
            tradeLicenseExpiry: "",
            email: "",
            phone: "",
            subdomain: "",
            scManagerId: ""
        };
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                            Create Organization
                        </h1>
                        <p className="text-black/60 dark:text-white/60 text-sm">
                            Add a new tenant organization to the system.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white/60 dark:bg-black/30 rounded-lg p-8 border border-black/5 dark:border-white/10">
                        <OrgForm />
                    </div>
                </div>
            </main>
        </div>
    );
}