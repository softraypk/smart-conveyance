"use client";

import Sidebar from "@/components/Sidebar";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

interface Trustee {
    id: number;
    name: string;
    address: string;
}

export default function TrusteeOfficePage() {
    const [search, setSearch] = useState("");
    const [email, setEmail] = useState("");
    const [trustees, setTrustees] = useState<Trustee[]>([]);
    const [trusteeId, setTrusteeId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const route = useRouter();

    const listTrusteeOffice = async () => {
        setLoading(true);
        try {
            const response = await api("/trusteeOffice", {method: "GET"});

            if (response?.ok || response?.status === 200) {
                setTrustees(response.results?.data || []);
            } else {
                toast.error("Error: " + (response.results?.message || "Failed to fetch trustees"));
            }
        } catch (e) {
            toast.error("Network error while fetching trustees");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listTrusteeOffice();
    }, []);

    const handleShowBox = (id: number) => {
        setShowModal(true);
        setTrusteeId(id);
    }

    const handlerSendInviteForm = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            email: email
        }

        try {
            const response = await api(`/trusteeOffice/${trusteeId}/trustees`, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowModal(false);
                listTrusteeOffice();
            } else {
                toast.error("Error: " + response.results.message);
                console.log("Error fetching organizations:", response);
            }
        } catch
            (error) {
            toast.error("Fetch error:" + error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">

                <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
                    <p className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight">
                        Trustee Office
                    </p>
                    <button onClick={() => route.push("/trustee/new")}
                            className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold gap-2 hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="truncate">Add New</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <label className="flex-1 flex-col min-w-40 h-12 w-full">
                        <div className="relative w-full h-full">
                            <div
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark h-full placeholder:text-subtext-light dark:placeholder:text-subtext-dark pl-12 text-sm"
                                placeholder="Search by bank name or code..."
                            />
                        </div>
                    </label>
                    <div className="flex gap-2 items-center">
                        <button
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark px-4 hover:bg-primary/10 transition-colors">
                            <p className="text-text-light dark:text-text-dark text-sm font-medium">Region</p>
                            <span
                                className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-base">
                expand_more
              </span>
                        </button>
                        <button
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark px-4 hover:bg-primary/10 transition-colors">
                            <p className="text-text-light dark:text-text-dark text-sm font-medium">Status</p>
                            <span
                                className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-base">
                expand_more
              </span>
                        </button>
                    </div>
                </div>

                <div
                    className="bg-content-light dark:bg-content-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead
                                className="bg-background-light dark:bg-background-dark text-xs uppercase text-subtext-light dark:text-subtext-dark">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        className="form-checkbox rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50"
                                        type="checkbox"
                                    />
                                </th>
                                <th className="px-6 py-3 font-semibold">Trustee Office</th>
                                <th className="px-6 py-3 font-semibold">Address</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6}
                                        className="p-4 text-center text-subtext-light dark:text-subtext-dark">
                                        Loading...
                                    </td>
                                </tr>
                            ) : trustees.length > 0 ? (
                                trustees.map((trustee: Trustee) => (
                                    <tr
                                        key={trustee.id}
                                        className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark"
                                    >
                                        <td className="p-4">
                                            <input
                                                className="form-checkbox rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50"
                                                type="checkbox"
                                            />
                                        </td>
                                        <th className="px-6 py-4 font-medium whitespace-nowrap text-text-light dark:text-text-dark">
                                            {trustee.name}
                                        </th>
                                        <td className="px-6 py-4 text-subtext-light dark:text-subtext-dark">{trustee.address}</td>
                                        <td className="px-6 py-4">
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                          Active
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a onClick={(e) => {
                                                    e.preventDefault();
                                                    handleShowBox(trustee.id)
                                                }}
                                                   className="font-semibold text-primary hover:underline cursor-pointer mr-3">
                                                    <span className="material-symbols-outlined">chat_paste_go</span>
                                                </a>
                                                <button
                                                    onClick={() => route.push(`/trustee/${trustee.id}/show`)}
                                                    className="flex size-8 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors">
                                                    <span
                                                        className="material-symbols-outlined text-base">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => route.push(`/trustee/${trustee.id}/edit`)}
                                                    className="flex size-8 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors">
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}
                                        className="p-4 text-center text-subtext-light dark:text-subtext-dark">
                                        No Trustee Office found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {/* ✅ Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Modal content */}
                    <div
                        className="w-full max-w-md mx-auto bg-white dark:bg-background-dark/50 rounded-xl shadow-2xl p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-xl font-bold">×
                        </button>
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Invite New Trustee
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Enter the details below to send an invitation.
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={handlerSendInviteForm}>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    htmlFor="email"
                                >
                                    Email Address *
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    id="email"
                                    placeholder="name@example.com"
                                    required
                                    type="email"/>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-colors duration-300"
                            >
                                Send Invite
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
