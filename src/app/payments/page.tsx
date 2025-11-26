"use client"

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";

function PaymentsPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <h2 className="text-3xl font-bold text-on-surface-light dark:text-on-surface-dark">Payments</h2>
                        <p className="text-muted-light dark:text-muted-dark mt-2 sm:mt-0">
                            <button
                                onClick={() => router.push("/invoices/new")}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all">
                                <span className="material-symbols-outlined">add_circle</span><span>New Invoice</span>
                            </button>
                        </p>
                    </div>
                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                        <div className="p-6 border-b border-border-light dark:border-border-dark">
                            <h3 className="text-xl font-semibold text-on-surface-light dark:text-on-surface-dark">Receipt
                                List
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-background-light dark:bg-background-dark">
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider">Invoice</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider text-right">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-on-surface-light dark:text-on-surface-dark tracking-wider"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#12345</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">INV-2023-001</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light dark:text-on-surface-dark text-right font-medium">AED
                                        5,000.00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Aug
                                        15, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Credit
                                        Card
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="text-primary hover:underline" href="#">View</a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#67890</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">INV-2023-002</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light dark:text-on-surface-dark text-right font-medium">AED
                                        2,500.00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Aug
                                        20, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Bank
                                        Transfer
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="text-primary hover:underline" href="#">View</a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#11223</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">INV-2023-003</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light dark:text-on-surface-dark text-right font-medium">AED
                                        7,500.00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Sep
                                        01, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Cash</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="text-primary hover:underline" href="#">View</a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#44556</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">INV-2023-004</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light dark:text-on-surface-dark text-right font-medium">AED
                                        10,000.00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Sep
                                        10, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Credit
                                        Card
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="text-primary hover:underline" href="#">View</a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">#77889</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">INV-2023-005</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-light dark:text-on-surface-dark text-right font-medium">AED
                                        1,250.00
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Sep
                                        15, 2023
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-light dark:text-muted-dark">Bank
                                        Transfer
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a className="text-primary hover:underline" href="#">View</a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 border-t border-border-light dark:border-border-dark flex justify-end">
                            <button
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all">
                                <span className="material-symbols-outlined">download</span>
                                <span>Download All as PDF</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default PaymentsPage;