"use client"

import Sidebar from "@/components/Sidebar";
import CaseTabs from "@/components/CaseTabs";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

export default function OverviewPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [caseSingle, setCaseSingle] = useState<any>("");
    const [buyer, setBuyer] = useState<any>(null);
    const [seller, setSeller] = useState<any>(null);
    const params = useParams();
    const id = params.id;

    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const listCase = async (id: string) => {
            setIsLoading(true);
            try {
                const response = await api(`/cases/${id}`);

                if (response.ok) {
                    setCaseSingle(response.results?.data)
                    const buyerParty = response.results?.data?.parties?.find((p: any) => p.role === "BUYER");
                    const buyer = buyerParty?.members?.[0] || null;
                    setBuyer(buyer);

                    const sellerParty = response.results?.data?.parties?.find((p: any) => p.role === "SELLER");
                    const seller = sellerParty?.members?.[0] || null;
                    setSeller(seller);

                } else {
                    toast.error("Error: " + response.results.message);
                }
            } catch (error) {
                toast.error("Error: " + error);
            } finally {
                setIsLoading(false);
            }
        }
        listCase(id as string);
    }, [id])
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col w-full">
                <Sidebar/>
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
                        <div className="flex flex-col max-w-[960px] flex-1">


                            <div className="flex flex-wrap justify-between gap-3 p-4">
                                <div className="flex flex-col gap-3 min-w-72">
                                    <p className="text-4xl font-black text-[#0d171b] dark:text-white leading-tight tracking-tight">
                                        Create New Case
                                    </p>
                                    <p className="text-base text-[#4c809a] dark:text-gray-400">
                                        Please fill in the general details for the new case.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">

                                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm">
                                    <CaseTabs/>

                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Case Reference
                                                Number</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">#{caseSingle.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Case Type</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">{caseSingle.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Estimated Completion
                                                Date</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">31/12/2024</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Assigned
                                                Solicitor/Team</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">John Doe
                                                Legal Team</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm">
                                    <h2
                                        className="text-[#333333] dark:text-white text-xl font-bold leading-tight tracking-tight px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-gray-500 dark:text-gray-400">home</span>
                                        Property Details
                                    </h2>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div className="col-span-2">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Full Property
                                                Address</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">
                                                {caseSingle.property?.emirate} {caseSingle.property?.unit} {caseSingle.property?.community}, {caseSingle.property?.building}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">DEED NO</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">
                                                {caseSingle.property?.titleDeedNo}
                                            </p>
                                        </div>
                                        {/*<div>*/}
                                        {/*    <p className="text-gray-500 dark:text-gray-400 text-sm">Tenure</p>*/}
                                        {/*    <p className="text-[#333333] dark:text-white text-base font-medium">Freehold</p>*/}
                                        {/*</div>*/}
                                        {/*<div>*/}
                                        {/*    <p className="text-gray-500 dark:text-gray-400 text-sm">Purchase Price</p>*/}
                                        {/*    <p className="text-[#333333] dark:text-white text-base font-medium">$500,000.00</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm">
                                    <h2
                                        className="text-[#333333] dark:text-white text-xl font-bold leading-tight tracking-tight px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-gray-500 dark:text-gray-400">person</span>
                                        Buyer Details
                                    </h2>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Full Name</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">
                                                {buyer?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Contact
                                                Information</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">(123)
                                                {buyer?.phone} | {buyer?.user?.email}</p>
                                        </div>
                                        {/*<div className="col-span-2">*/}
                                        {/*    <p className="text-gray-500 dark:text-gray-400 text-sm">Current Address</p>*/}
                                        {/*    <p className="text-[#333333] dark:text-white text-base font-medium">456 Oak*/}
                                        {/*        Avenue, Sometown, ST 67890</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm">
                                    <h2
                                        className="text-[#333333] dark:text-white text-xl font-bold leading-tight tracking-tight px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                        <span
                                            className="material-symbols-outlined text-gray-500 dark:text-gray-400">real_estate_agent</span>
                                        Seller Details
                                    </h2>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Full Name</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">
                                                {seller?.name}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Contact
                                                Information</p>
                                            <p className="text-[#333333] dark:text-white text-base font-medium">(987)
                                                {seller?.phone} | {seller?.user?.email}</p>
                                        </div>
                                        {/*<div className="col-span-2">*/}
                                        {/*    <p className="text-gray-500 dark:text-gray-400 text-sm">Current Address</p>*/}
                                        {/*    <p className="text-[#333333] dark:text-white text-base font-medium">789 Pine*/}
                                        {/*        Street, Otherville, OT 54321</p>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 p-4 mt-6">
                                <button
                                    onClick={() => router.push('/cases/')}
                                    className="px-6 py-2.5 rounded text-[#333333] dark:text-white font-semibold text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    Back
                                </button>
                                {/*<button*/}
                                {/*    */}
                                {/*    className="px-6 py-2.5 rounded text-white font-semibold text-base bg-primary hover:bg-primary/90 transition-colors">*/}
                                {/*    Create Case*/}
                                {/*</button>*/}
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>

    )
}