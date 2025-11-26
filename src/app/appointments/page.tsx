"use client"


import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

function Appointments() {
    const [cases, setCases] = useState([])
    const router = useRouter();

    useEffect(() => {
        const listCases = async () => {
            try {
                const response = await api('/booking', {
                    method: "GET",
                })

                if (response.ok) {
                    setCases(response.results?.data?.bookings)
                } else {
                    toast.error("Error: " + response.results.message)
                }

            } catch (e) {
                toast.error("Error: " + e);
            }
        }

        listCases();
    }, []);

    return (
        <div className="flex min-h-screen flex-col">
            <Sidebar/>
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">Scheduled
                                Appointments</h1>
                            <p className="text-muted-light dark:text-muted-dark mt-1">View and manage your upcoming
                                appointments.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <span
                                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">search</span>
                                <input
                                    className="pl-10 pr-4 py-2 w-full md:w-64 rounded-DEFAULT border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                    placeholder="Search cases..." type="text"/>
                            </div>
                            <button
                                onClick={() => router.push("/appointments/new")}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-DEFAULT font-semibold hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined text-base">add</span>
                                <span>New Appointment</span>
                            </button>
                        </div>
                    </div>
                    <div
                        className="bg-white dark:bg-subtle-dark/50 rounded-lg shadow-sm overflow-hidden border border-border-light dark:border-border-dark">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-background-light dark:bg-background-dark/50">
                                <tr>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark"
                                        scope="col">Case ID
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark"
                                        scope="col">Buyer Name
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark"
                                        scope="col">Seller Name
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark"
                                        scope="col">Broker
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark"
                                        scope="col">Status
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark text-right"
                                        scope="col">Action
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {cases.map((c: any) => (
                                    <tr key={c.id}
                                        className="border-b border-border-light dark:border-border-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50">
                                        <td className="px-6 py-4 font-medium text-foreground-light dark:text-foreground-dark">
                                            {c.caseId}
                                        </td>
                                        <td className="px-6 py-4 text-muted-light dark:text-muted-dark">Sarah Al Maktoum
                                        </td>
                                        <td className="px-6 py-4 text-muted-light dark:text-muted-dark">Omar Al Rashid
                                        </td>
                                        <td className="px-6 py-4 text-muted-light dark:text-muted-dark">Elite Properties
                                        </td>
                                        <td className="px-6 py-4">
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">Scheduled</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a className="font-medium text-primary hover:underline"
                                               href={`/appointments/${c.caseId}/edit`}>View
                                                Appointment</a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div
                            className="flex items-center justify-between p-4 border-t border-border-light dark:border-border-dark">
                            <span
                                className="text-sm text-muted-light dark:text-muted-dark">Showing 1 to 6 of 10 results</span>
                            <div className="inline-flex items-center rounded-DEFAULT shadow-sm">
                                <button
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-DEFAULT border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-background-light dark:hover:bg-background-dark">
                                    Previous
                                </button>
                                <button
                                    className="relative -ml-px inline-flex items-center px-2 py-2 rounded-r-DEFAULT border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-background-light dark:hover:bg-background-dark">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Appointments;