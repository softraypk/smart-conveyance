"use client";

import Sidebar from "@/components/Sidebar";
import MortgageForm from "@/components/MortgageForm";
import {useState} from "react";
import {useParams} from "next/navigation";

export default function EditMortgagePage() {
    const [caseId, setCaseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id || null;

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">Loading </div>
        )
    }
    return (<div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-10">
                <div className="w-full max-w-lg">
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-lg p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Create Mortgage Application
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Submit details for a new mortgage request.
                            </p>
                        </div>

                        <MortgageForm id={id} loading={loading} setLoading={setLoading}/>
                    </div>
                </div>
            </main>
        </div>
    );
}