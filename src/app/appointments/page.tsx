"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import TrusteeCalender from "@/app/appointments/TrusteeCalender";
import PageLoader from "@/components/PageLoader";

export default function Appointments() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [complianceReadyCases, setComplianceReadyCases] = useState<any[]>([]);
    const [trusteeOffice, setTrusteeOffice] = useState<any[]>([]);
    const [isSelected, setIsSelected] = useState(true); // true = calendar view
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [bookingsResp, casesResp, trusteeOffice] = await Promise.all([
                    api("/bookings", {method: "GET"}),
                    api("/cases?statusFilter=COMPLIANCE_READY", {method: "GET"}),
                    api('/trusteeOffice', {method: "GET"}),
                ]);

                if (bookingsResp.ok) {
                    setBookings(bookingsResp.results?.data?.bookings || []);
                } else {
                    toast.error("Error: " + bookingsResp.results?.message);
                }

                if (casesResp.ok) {
                    setComplianceReadyCases(casesResp.results || []);
                } else {
                    toast.error("Error: " + casesResp.results?.message);
                }

                if (trusteeOffice.ok) {
                    setTrusteeOffice(trusteeOffice.results?.data || [])
                } else {
                    toast.error("Error: " + trusteeOffice.results?.message);
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                <PageLoader/>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Sidebar/>
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isSelected ? (
                    <TrusteeCalender
                        setLoading={setIsLoading}
                        bookings={bookings}
                        complianceReadyCases={complianceReadyCases}
                        trusteeOffice={trusteeOffice}
                    />
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Scheduled Appointments Table */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
                                    Scheduled Appointments
                                </h1>
                                <p className="text-muted-light dark:text-muted-dark mt-1">
                                    View and manage your upcoming appointments.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                  <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">
                    search
                  </span>
                                    <input
                                        className="pl-10 pr-4 py-2 w-full md:w-64 rounded-DEFAULT border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        placeholder="Search cases..."
                                        type="text"
                                    />
                                </div>
                                <button
                                    onClick={() => router.push("/appointments/new")}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-DEFAULT font-semibold hover:bg-primary/90 transition-colors"
                                >
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
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark">
                                            Case ID
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark">
                                            Buyer Name
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark">
                                            Seller Name
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark">
                                            Broker
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 font-semibold text-foreground-light dark:text-foreground-dark text-right">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bookings.map((b: any) => {
                                        const buyer = b.case?.parties?.find((p: any) => p.role === "BUYER")?.members?.[0];
                                        const seller = b.case?.parties?.find((p: any) => p.role === "SELLER")?.members?.[0];

                                        return (
                                            <tr
                                                key={b.id}
                                                className="border-b border-border-light dark:border-border-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50"
                                            >
                                                <td className="px-6 py-4 font-medium text-foreground-light dark:text-foreground-dark">
                                                    {b.caseId || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-muted-light dark:text-muted-dark">
                                                    {buyer?.name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-muted-light dark:text-muted-dark">
                                                    {seller?.name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-muted-light dark:text-muted-dark">
                                                    {b.office?.name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4">
                            <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                              {b.status}
                            </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a
                                                        className="font-medium text-primary hover:underline"
                                                        href={`/appointments/${b.id}/edit`}
                                                    >
                                                        View Appointment
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}