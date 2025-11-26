"use client"

import Sidebar from "@/components/Sidebar";
import {useParams, useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";

function ShowTrusteePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [trustees, setTrustees] = useState<any>([]);
    const [trusteeOffice, setTrusteeOffice] = useState<any>("");
    const [trusteeId, setTrusteeId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const params = useParams();
    const id = params.id;

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchTrustee = async () => {
            try {
                const response = await api(`/trusteeOffice/${id}/trustees`, {
                    method: "GET"
                });

                if (response.ok) {
                    setTrusteeOffice(response.results?.data?.trusteeOffice);
                    setTrustees(response.results?.data?.trustees)
                } else {
                    toast.error("Error: " + response.results?.message)
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTrustee();
        setIsLoading(false);
    }, [id]);

    const handleShowBox = (trustee: any) => {
        setShowModal(true);
        setTrusteeId(trustee.id);
        setEmail(trustee.email);
    }

    const handlerSendInviteForm = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await api(`/trusteeOffice/${trusteeOffice.id}/trustees/${trusteeId}/resend`, {
                method: "POST"
            });

            if (response.ok) {
                setShowModal(false);
            } else {
                toast.error("Error: " + response.results.message);
                console.log("Error fetching organizations:", response);
            }
        } catch
            (error) {
            toast.error("Fetch error:" + error);
        } finally {
            setIsLoading(false);
        }

    }


    if (isLoading && !trusteeOffice) {
        return (
            <div className="flex h-screen">
                <main className="flex-1 flex flex-col">
                    <PageLoader/>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen">
            <Sidebar/>
            <main className="flex-1 flex flex-col">
                <header
                    className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-end px-6">
                    <button
                        className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center text-sm font-bold">N
                    </button>
                </header>
                <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{trusteeOffice.name}</h1>
                            <div className="flex items-center gap-4">
                                <a className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                                   href="/trustee">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Back
                                </a>
                                <button
                                    onClick={() => router.push(`/trustee/${trusteeOffice.id}/edit`)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700">
                                    <span className="material-symbols-outlined">edit</span>
                                    Edit Office
                                </button>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {/*<div>*/}
                                {/*    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Office Code</p>*/}
                                {/*    <p className="font-medium text-slate-800 dark:text-slate-200">TRO-00123</p>*/}
                                {/*</div>*/}
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Address</p>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">{trusteeOffice.address}</p>
                                </div>
                                {/*<div>*/}
                                {/*    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Region</p>*/}
                                {/*    <p className="font-medium text-slate-800 dark:text-slate-200">Central</p>*/}
                                {/*</div>*/}
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Status</p>
                                    <span
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{trusteeOffice.status}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Trustees</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                            scope="col">Name
                                        </th>
                                        <th className="px-6 py-3 font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                            scope="col">Email
                                        </th>
                                        <th className="px-6 py-3 font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                                            scope="col">Phone
                                        </th>
                                        <th className="px-6 py-3 font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right"
                                            scope="col">Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {trustees.map((trustee: any) => (
                                        <tr key={trustee.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">{trustee.name || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{trustee.email || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{trustee.phone || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleShowBox(trustee)
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium text-primary bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">Re-invitation
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
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
                                        readOnly
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
            </main>
        </div>
    )
}

export default ShowTrusteePage;