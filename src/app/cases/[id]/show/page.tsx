"use client"

import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useParams} from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageLoader from "@/components/PageLoader";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

export default function ShowCasePage() {
    const [selectCase, setSelectCase] = useState<any>("");
    const [checklistItems, setChecklistItems] = useState<any>([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const params = useParams();
    const caseId = params.id;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // Load Case
    useEffect(() => {
        if (!caseId) return;
        setLoading(true);
        const listCase = async () => {
            try {
                const response = await api(`/cases/${caseId}`, {method: "GET"});

                console.log(response);

                if (response.ok) {
                    const fetchCase = response.results?.data || [];
                    setSelectCase(fetchCase);
                    setChecklistItems(fetchCase.checklistItems)
                    setDocuments(fetchCase.documents);
                } else {
                    toast.error("Error: " + response.results?.message);
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setLoading(false);
            }
        }
        listCase();
    }, [caseId]);

    const buyer = selectCase.parties?.find((p: any) => p.role === "BUYER")?.members?.[0];
    const seller = selectCase.parties?.find((p: any) => p.role === "SELLER")?.members?.[0];

    const handleView = (document: any) => {
        // Example: open URL
        window.open(document.fileUrl, "_blank");
    };

    // const getS3FileName = (url: string) => {
    //     const cleanUrl = url.split("?")[0];     // remove signed query params
    //     return cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
    // };
    //
    //
    // const handleDownload = (document: any) => {
    //     const fileName = getS3FileName(document.url);
    //
    //     const link = document.createElement("a");
    //     link.href = document.url;
    //     link.download = fileName; // correct filename from S3
    //     link.click();
    // };


    if (loading && !selectCase) {
        return (
            <PageLoader/>
        )
    }

    return (
        <div className={user?.role === "SC_ADMIN" ? "flex min-h-screen" : "flex flex-col min-h-screen"}>
            <Sidebar/>
            <main className="flex-grow container mx-auto px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Case Processing</h2>
                        <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Finalize the booked case by
                            completing the checklist and reviewing documents.</p>
                    </div>
                    <div
                        className="bg-white dark:bg-zinc-900/50 rounded-lg shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Case Header</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 p-6">
                            <div className="py-3">
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Case
                                    ID</p>
                                <p className="text-base font-semibold text-text-light dark:text-text-dark mt-1">#{selectCase.id.split("-")[0]}</p>
                            </div>
                            <div className="py-3">
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Property</p>
                                <p className="text-base font-semibold text-text-light dark:text-text-dark mt-1">{selectCase.property?.community}, {selectCase.property?.unit}</p>
                            </div>
                            <div className="py-3">
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Buyer</p>
                                <p className="text-base font-semibold text-text-light dark:text-text-dark mt-1">{buyer?.name}</p>
                            </div>
                            <div className="py-3">
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Seller</p>
                                <p className="text-base font-semibold text-text-light dark:text-text-dark mt-1">{seller?.name}</p>
                            </div>
                            <div className="py-3 md:col-span-2">
                                <p className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Broker</p>
                                <p className="text-base font-semibold text-text-light dark:text-text-dark mt-1">Elite
                                    Properties</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-8 bg-white dark:bg-zinc-900/50 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Processing
                                Checklist</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {checklistItems.map((checklistItem: any) => (
                                <label key={checklistItem.id}
                                       className="flex items-center p-3 rounded-md hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer">
                                    <input
                                        checked={checklistItem.status === "COMPLETE"}
                                        disabled
                                        className="h-5 w-5 rounded border-border-light dark:border-border-dark text-primary focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark"
                                        type="checkbox"/>
                                    <span
                                        className="ml-4 text-base text-text-light dark:text-text-dark">{checklistItem.label.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c: any) => c.toUpperCase())}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div
                        className="mt-8 bg-white dark:bg-zinc-900/50 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Case
                                Documents</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {documents.map((document: any) => (
                                    <li
                                        key={document.id}
                                        className="flex items-center justify-between p-3 rounded-md bg-background-light/50 dark:bg-background-dark/50">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark">
                                              description
                                            </span>

                                            {/* Humanized document kind */}
                                            <span className="text-base text-text-light dark:text-text-dark">
                                              {document.kind
                                                  .toLowerCase()
                                                  .replace(/_/g, " ")
                                                  .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* View Button */}
                                            {/*<button*/}
                                            {/*    className="text-primary hover:underline text-sm font-medium"*/}
                                            {/*    onClick={() => handleView(document)}>View*/}
                                            {/*</button>*/}
                                            {/* Download Button */}
                                            <button
                                                className="text-primary hover:underline text-sm font-medium"
                                                onClick={() => handleView(document)}>Download
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <button
                            className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            Finalize Case
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}