"use client";

import Sidebar from "@/components/Sidebar";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";

export default function InvoiceShowPage() {
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            setIsLoading(true);

            try {
                const response = await api(`/invoices/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    setInvoice(response.results);
                } else {
                    toast.error("Error: " + response.results?.message);
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    if (isLoading || !invoice) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                <PageLoader/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg">
                    {(isLoading || !invoice) && <PageLoader/>}
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Invoice #INV-{invoice.id}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Issued on:{" "}
                            {invoice.createdAt
                                ? new Date(invoice.createdAt).toLocaleDateString("en-GB")
                                : "N/A"}
                        </p>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                Case Information
                            </h2>

                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Case ID:</strong> {invoice.caseId}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Location:</strong> {invoice.location}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                Party Details
                            </h2>

                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Currency:</strong> {invoice.currency}
                            </p>

                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>Due Date:</strong>{" "}
                                {invoice.dueDate
                                    ? new Date(invoice.dueDate).toLocaleDateString("en-GB")
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mb-10">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Invoice Items
                        </h2>

                        {/* TODO: Replace hard-coded rows with invoice.items.map(...) when backend ready */}
                        <div className="overflow-x-auto">
                            <table
                                className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Amount (AED)</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium">Subtotal</th>
                                </tr>
                                </thead>

                                <tbody
                                    className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {invoice.items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">{item.kind}</td>
                                        <td className="px-4 py-3">
                                            {new Intl.NumberFormat("en-AE", {
                                                style: "currency",
                                                currency: "AED",
                                            }).format(item.amount)}
                                        </td>
                                        <td className="px-4 py-3">{item.quantity}</td>
                                        <td className="px-4 py-3">{item.description}</td>
                                        <td className="px-4 py-3">
                                            {new Intl.NumberFormat("en-AE", {
                                                style: "currency",
                                                currency: "AED",
                                            }).format(item.amount * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end">
                        <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-lg w-full md:w-1/2">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Total:</span>
                                <span>
                                    {new Intl.NumberFormat("en-AE", {
                                        style: "currency",
                                        currency: "AED",
                                    }).format(invoice.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}