'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageLoader from '@/components/PageLoader';
import MonthlyCaseStatusChart from "@/components/MonthlyCaseStatusChart";
import {transformMonthlyCases} from '@/utils/transformMonthlyCases';

interface AppointmentFormProps {
    exceptions: any[]
    stats: any;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrgAdmin({exceptions, stats, setLoading}: AppointmentFormProps) {
    const route = useRouter();

    const months = stats?.monthlyCases?.map((m: { month: any; }) => m.month) ?? [];
    const chartData = transformMonthlyCases(stats?.monthlyCases);

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>

            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Dashboard
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Overview of all cases under your branch / organization
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            label="Active Cases"
                            value={stats?.activeCases ?? 0}
                        />

                        <StatCard
                            label="Cases Ready for Trustee Booking"
                            value={stats?.trusteeBookingCases ?? 0}
                        />

                        <StatCard
                            label="Overdue Invoices"
                            value={stats?.overdueInvoices ?? 0}
                            color="text-red-500 dark:text-red-400"
                        />

                        <StatCard
                            label="Expiring FOLs"
                            value={stats?.expiringFOLs ?? 0}
                            color="text-orange-500 dark:text-orange-400"
                        />
                    </div>

                    {chartData.length > 0 && (
                        <MonthlyCaseStatusChart
                            data={chartData}
                            months={months}
                        />
                    )}

                    {/* Exceptions Table */}
                    <div className="mt-12">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Exceptions
                            </h3>

                            <button
                                onClick={() => route.push('/exceptions/new')}
                                className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined text-base">add</span>
                                Create Exception
                            </button>
                        </div>

                        <div
                            className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        {[
                                            'Case ID',
                                            'Case Type',
                                            'Status',
                                            'Exception Details',
                                            'Actions',
                                        ].map(header => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {exceptions.length > 0 &&
                                        exceptions.map(row => (
                                            <tr key={row.id}>
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                    {row.id}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {row.type}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {row.status}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                    {row.description}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {['done', 'edit', 'gavel'].map(icon => (
                                                            <button
                                                                key={icon}
                                                                className="rounded-full p-2 text-slate-500 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                                                            >
                                  <span className="material-symbols-outlined text-xl">
                                    {icon}
                                  </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}

                                    {exceptions.length === 0 && (
                                        <tr>
                                            <td className="px-6 py-12 text-center text-slate-400 dark:text-slate-500"
                                                colSpan={5}>
                                                <div className="flex flex-col items-center">
                                                    <span
                                                        className="material-icons-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                                                    <p>No exceptions found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

/* ---------- Reusable Stat Card ---------- */
function StatCard({
                      label,
                      value,
                      color = '',
                  }: {
    label: string;
    value: number;
    color?: string;
}) {
    return (
        <div
            className="rounded-lg bg-white dark:bg-slate-800/50 p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className={`mt-2 text-3xl font-bold text-slate-900 dark:text-white ${color}`}>
                {value}
            </p>
        </div>
    );
}
