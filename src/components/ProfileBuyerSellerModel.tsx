"use client";
import {FormEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {api} from "@/lib/api";
import Image from "next/image";

interface Props {
    userId: string | null;
    open: boolean;
    onClose: () => void;
}

export default function ProfileBuyerSellerModel({userId, open, onClose}: Props) {
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        if (!open || !userId) return;

        const loadCase = async () => {
            try {
                const response = await api(`/users/${userId}`, {method: "GET"});
                if (response.ok) {
                    setUser(response.results);
                } else {
                    toast.error("Error: " + (response.results?.message || "Unable to fetch case"));
                }
            } catch (e) {
                toast.error("Error: " + e);
            }
        };

        loadCase();
    }, [open, userId]);

    if (!open) return null;
    return (
        <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 md:p-8">
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                <div
                    className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-5">
                        <div
                            className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                            <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{user?.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{user?.parties[0]?.party?.role.toLowerCase().replace(/^./, (c: any) => c.toUpperCase())} Profile
                                    •
                                    PRF-{user?.id.split("-")[0]}</p>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1
    ${
                                        user?.verifiedEmail
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}
                                >
                              <span className="material-symbols-outlined text-xs">
                                {user?.verifiedEmail ? 'check_circle' : 'cancel'}
                              </span>
                                    {user?.verifiedEmail ? 'Verified' : 'Not Verified'}
                            </span>

                            </div>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-slate-500">close</span>
                    </button>
                </div>
                <div
                    className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-slate-50/50 dark:bg-background-dark/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email
                                Address</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone
                                Number</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.phone}</p>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {user?.isUAEResident ? `Non-Resident (${user?.nonResident?.address?.country})` : 'UAE Resident'}
                            </p>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Country</p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.nonResident?.address?.country}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <span
                                        className="material-symbols-outlined text-primary text-xl">verified_user</span>
                                    Identity Verification
                                </h3>
                                <span
                                    className={`px-2 py-1 text-white text-[10px] font-black rounded uppercase
    ${
                                        user?.nonResident?.livenessResult === 'PASSED'
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                    }`}
                                >
                              Liveness {user?.nonResident?.livenessResult === 'PASSED' ? 'PASSED' : 'FAILED'}
                            </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div
                                    className="group relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg border-2 border-slate-300 dark:border-slate-700 overflow-hidden">
                                    <img
                                        alt="Passport Verification"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={
                                            user?.nonResident?.passportPicture?.url ||
                                            'https://lh3.googleusercontent.com/aida-public/AB6AXuALdW_plhuRiuk2b1TdAoeqfTSeMeGspMcFQezW-PNSI_gXTreY2gEu7fji2_FPWKn5UinnrCnr4bZT85admMa51dBnT6jbgsMJZImJ5RT1oTYQvjIOhhtFZSJQz7UALppgMEgL4ETNO-bR6lIgpQjBxkgubKCoMZe_cGmSSC83qa09fV3ay1KyNwtaQIHBcHdcysenXY2z7gUdQilx-uUCzDAKxivtr8WMCHmaAw2BbGP73mFiw-sAPtFqrUPj1iDwfCjoCR6Pn64'
                                        }
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2">
                                        <p className="text-[10px] font-bold text-white uppercase flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">badge</span> Passport /
                                            National ID
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="group relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg border-2 border-slate-300 dark:border-slate-700 overflow-hidden">
                                    <img
                                        alt="Selfie Verification"
                                        className="absolute inset-0 w-full h-full object-cover"
                                        src={
                                            user?.nonResident?.selfie?.url ||
                                            'https://lh3.googleusercontent.com/aida-public/AB6AXuC0QsWoGkPU_43UYTa0OSQXTVVb9WfWMvIbfSdzNfVKC-3_vb1PNPEGCCkg_lJ8xDqvR-J7Xxqf_28Pjz96W5Y1YQWgEi1QNYnXTG6uYkUrXPX8TNQKHUwEaqb94AfEJHddn_62oJ1vDJnhSBm48fxaITmXe9BIujM_86-whyI1t2dMKN3ExDTr_DlmtF5pOmtcX-uCG6LWWGAXWG33Ic6v14RdgOteWFR39TEWHp7fSW6wl9XPLumKNq7jQVMkA4GbanDLbXUPGUw'
                                        }
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2">
                                        <p className="text-[10px] font-bold text-white uppercase flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">face</span> Live Selfie
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                Residential Address
                            </h3>
                            <div
                                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Address Line</span>
                                    <span
                                        className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.nonResident?.address?.line1}, {user?.nonResident?.address?.line2}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span
                                            className="text-[10px] font-bold text-slate-400 uppercase">City / State</span>
                                        <span
                                            className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.nonResident?.address?.city}, {user?.nonResident?.address?.state}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-[10px] font-bold text-slate-400 uppercase">Postal Code</span>
                                        <span
                                            className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.nonResident?.address?.postalCode}</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Country</span>
                                    <span
                                        className="text-sm font-bold text-slate-900 dark:text-white block">{user?.nonResident?.address?.country}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">corporate_fare</span>
                                Linked Organization
                            </h3>
                            <div
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border-l-4 border-l-primary border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                                        <span className="material-symbols-outlined text-slate-500">apartment</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.org?.legalName}</p>
                                        <p className="text-xs font-medium text-slate-500">({user?.org?.name})</p>
                                    </div>
                                </div>
                                <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-xl">folder_open</span>
                                Active Cases
                            </h3>
                            <div
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase">Role</th>
                                        <th className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase">Type</th>
                                        <th className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase">Status</th>
                                        <th className="px-4 py-2 text-right"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span
                                                className="text-xs font-bold text-slate-900 dark:text-white">SELLER</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div
                                                className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                                                <span className="material-symbols-outlined text-sm">sell</span> SALE
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">AGREED</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span
                                                className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary">chevron_right</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-800 pb-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Parties
                                / Related Cases</h3>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Case
                                            Reference
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Party
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    <tr className="group">
                                        <td className="px-6 py-4">
                                            <span
                                                className="text-sm font-bold text-primary hover:underline cursor-pointer">#SL-2024-001</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Salman Khan</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Seller</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="text-xs font-bold text-slate-600 dark:text-slate-300">SALE</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-3 py-1 text-[10px] font-black rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">AGREED</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors">
                                                    <span
                                                        className="material-symbols-outlined text-xl">visibility</span>
                                                </button>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors">
                                                    <span
                                                        className="material-symbols-outlined text-xl">description</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky bottom-0 z-10">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <span className="material-symbols-outlined text-sm">history</span>
                        Last activity: Oct 25, 2024 • 14:20 PM
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all uppercase tracking-tight">
                            Close
                        </button>
                        {/*<button*/}
                        {/*    className="px-5 py-2.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 uppercase tracking-tight">*/}
                        {/*    Save Changes*/}
                        {/*</button>*/}
                    </div>
                </div>
            </div>
        </div>
    )
}