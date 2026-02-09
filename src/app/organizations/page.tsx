"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface Organization {
    id: number;
    name: string;
    legalName: string;
    reraNumber: string;
    email: string;
    createdAt: string;
    status: string;
}

export default function OrganizationsPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [initialBranchCheck, setInitialBranchCheck] = useState<boolean>(true);
    const [id, setId] = useState<string | number | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [branch, setBranch] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModalBranch, setShowModalBranch] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const response = await api("/orgs", {method: "GET"}); // ✅ Your endpoint

                console.log(response.results);

                if (response.ok) {
                    setOrganizations(response.results.data?.orgs || []);
                } else {
                    setError(response.results.message);
                    console.error("Error fetching organizations:", response.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    const handleShowBox = (id: string | number) => {
        setShowModal(true);
        setId(id);
    }

    const handleShowBoxBranch = (id: string | number) => {
        setShowModalBranch(true);
        setId(id);
    }

    const handlerSendInviteForm = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            name: name,
            email: email,
            initialBranchCheck: initialBranchCheck
        }

        try {
            const response = await api(`/orgs/${id}/admins`, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setShowModal(false);
                toast.success("Success:" + response.results?.message);
            } else {
                toast.error("Error: " + response.results.message);
            }
        } catch
            (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }

    }

    const handleCreateBranch = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const payload = {
            name: branch,
            address
        }

        try {
            const response = await api(`/orgs/${id}/branches`, {
                method: "POST",
                body: JSON.stringify(payload)
            })
            if (response.ok) {
                setShowModal(false);
                toast.success("Branch created");
            } else {
                toast.error("error", response.results.message);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                            Organizations
                        </h1>
                        <button
                            onClick={() => router.push("/organizations/new")}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create New Organization
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by property"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                            />
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by party name"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                            />
                        </div>

                        <div>
                            <select
                                className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4">
                                <option>Status: All</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Pending</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="date"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div
                        className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-black/5 dark:border-white/5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-black/10 dark:border-white/10">
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Org
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Legal
                                    / Trading Name
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">RERA
                                    #
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Status</th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Created
                                    At
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">
                                        Loading organizations...
                                    </td>
                                </tr>
                            ) : organizations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">
                                        No organizations found
                                    </td>
                                </tr>
                            ) : (
                                organizations.map((Organization) => (
                                    <tr
                                        key={Organization.id}
                                        className="border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-4 font-medium">{Organization.id}</td>
                                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{Organization.legalName}</td>
                                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{Organization.reraNumber}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${Organization.status}`}>
                                                {Organization.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{Organization.createdAt}</td>
                                        <td className="px-4 py-4">
                                            <a onClick={(e) => {
                                                e.preventDefault();
                                                handleShowBox(Organization.id)
                                            }}
                                               className="font-semibold text-primary hover:underline cursor-pointer mr-3">
                                                Invite
                                            </a>

                                            <a onClick={(e) => {
                                                e.preventDefault();
                                                handleShowBoxBranch(Organization.id)
                                            }}
                                               className="font-semibold text-primary hover:underline cursor-pointer mr-3">
                                                New Branch
                                            </a>

                                            <a onClick={() => router.push(`organizations/${Organization.id}`)}
                                               className="font-semibold text-primary hover:underline cursor-pointer">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                ))
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
                                Invite New Member
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Enter the details below to send an invitation.
                            </p>
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handlerSendInviteForm}>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    htmlFor="name"
                                >
                                    Name *
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    id="name"
                                    placeholder="Jon Doe"
                                    required
                                    type="text"/>
                            </div>

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
            {showModalBranch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Modal content */}
                    <div
                        className="w-full max-w-lg mx-auto bg-white dark:bg-background-dark/60 rounded-xl shadow-2xl p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 relative animate-fadeIn">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModalBranch(false)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-2xl font-bold"
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Create New Branch
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Set up the main office for your firm.
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleCreateBranch} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="branchName"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Branch Name *
                                </label>
                                <input
                                    id="branch"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    placeholder="e.g. Dubai Main Office"
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="address"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Address *
                                </label>
                                <textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={3}
                                    placeholder="Enter the full address"
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    required
                                />
                            </div>

                            {/*<div className="space-y-2">*/}
                            {/*    <label*/}
                            {/*        htmlFor="timezone"*/}
                            {/*        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"*/}
                            {/*    >*/}
                            {/*        Timezone **/}
                            {/*    </label>*/}
                            {/*    <select*/}
                            {/*        id="timezone"*/}
                            {/*        value={timezone}*/}
                            {/*        onChange={(e) => setTimezone(e.target.value)}*/}
                            {/*        className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white"*/}
                            {/*        required*/}
                            {/*    >*/}
                            {/*        <option value="">Select a timezone</option>*/}
                            {/*        <option value="Asia/Dubai">(GMT+4) Dubai</option>*/}
                            {/*        <option value="Asia/Riyadh">(GMT+3) Riyadh</option>*/}
                            {/*        <option value="Asia/Qatar">(GMT+3) Qatar</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition"
                            >
                                Create Branch
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}