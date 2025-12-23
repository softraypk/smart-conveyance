"use client"

import Sidebar from "@/components/Sidebar";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import SummaryTab from "@/components/SummaryTab";
import ValuationTab from "@/components/ValuationTab";
import OffersTab from "@/components/OffersTab";
import PageLoader from "@/components/PageLoader";

export default function ShowMortgagePage() {
    const [mortgage, setMortgage] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("summary");

    const params = useParams();
    const id = params.id;

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchMortgage = async () => {
            try {
                const respnse = await api(`/cases/${id}/mortgage`);
                if (respnse.ok) {
                    setMortgage(respnse.results.data)
                } else {
                    toast.error('Error: ' + respnse.results.message);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMortgage();
    }, [id])

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && <PageLoader/>}
                <div className="max-w-7xl mx-auto">
                    {/* HEADER */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Mortgage Application
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Case ID: {mortgage?.caseId}
                        </p>
                    </div>

                    {/* TABS */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                            {[
                                {key: "summary", label: "Summary"},
                                {key: "valuation", label: "Valuation"},
                                {key: "offers", label: "Offers"},
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                                        activeTab === tab.key
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-500"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* TAB CONTENT */}
                    <div className="mt-8">
                        {activeTab === "summary" && (
                            <SummaryTab mortgage={mortgage}/>
                        )}
                        {activeTab === "valuation" && (
                            <ValuationTab caseId={mortgage?.caseId} setIsLoading={setIsLoading}/>
                        )}
                        {activeTab === "offers" && (
                            <OffersTab mortgage={mortgage}/>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}





