"use client";

import Sidebar from "@/components/Sidebar";
import PageLoader from "@/components/PageLoader";
import InvoiceForm from "@/components/InvoiceForm";
import {useParams} from "next/navigation";
import {use, useState} from "react";

interface Props {
    params: Promise<{ id: string | string[] }>;
}

export default function InvoiceEditPage({params}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const unwrappedParams = use(params); // ✅ unwrap the promise
    const rawId = unwrappedParams.id;

    const invoiceId: string | null = Array.isArray(rawId)
        ? rawId[0]
        : rawId ?? null;


    if (!invoiceId) {
        return (
            <>
                {isLoading && <PageLoader/>}
            </>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-10">
                <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-lg">

                    {isLoading && <PageLoader/>}

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {invoiceId ? "Update Invoice" : "Create Invoice"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {invoiceId ? "Modify the invoice details." : "Enter invoice details for this case."}
                        </p>
                    </div>

                    <InvoiceForm
                        invoiceId={invoiceId}
                        setIsLoading={setIsLoading}
                    />
                </div>
            </main>
        </div>
    );
}