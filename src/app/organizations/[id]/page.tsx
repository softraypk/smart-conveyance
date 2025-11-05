"use client";

import {FormEvent, useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {api} from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import * as wasi from "node:wasi";

interface Organization {
    id: string;
    legalName: string;
    name: string;
    email: string;
    phone: string;
    subdomain: string;
    country: string | null;
    emirate: string | null;
    website: string | null;
    reraNumber: string | null;
    tradeLicenseNo: string | null;
    tradeLicenseExpiry: string | null;
    brandColor: string | null;
    dataResidency: string | null;
    languageDefault: string | null;
    tier: string | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
    reraCertificate: {
        filename: string;
        name: string;
        url: string;
    };
    tradeLicense: {
        filename: string;
        name: string;
        url: string;
    }
    logo: string | null;
}

interface Broker {
    id: string;
    name: string;
    phone: string;
    address: string;
}

export default function OrganizationShowPage() {
    const {id} = useParams<{ id: string }>();
    const [status, setStatus] = useState("PENDING_REVIEW");
    const [notes, setNotes] = useState("");
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchOrganization = async () => {
            setLoading(true);
            try {
                const response = await api(`/orgs/${id}`, {method: "GET"});

                console.log("API Response:", response);

                if (response.ok && response.results?.data) {
                    // ✅ Use correct structure from your JSON
                    setOrganization(response.results?.data);
                    setStatus(response.results?.data.status || "PENDING_REVIEW");
                } else {
                    console.error("Error fetching organization:", response.error || response);
                    setOrganization(null);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setOrganization(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, [id]);

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            try {
                const response = await api(`/orgs/${organization?.id}/branches`, {method: "GET"});

                console.log("API Response:", response);

                if (response.ok && response.results?.data) {
                    // ✅ Use correct structure from your JSON
                    setBrokers(response.results?.data);
                } else {
                    console.error("Error fetching organization:", response.error || response);
                    setOrganization(null);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setOrganization(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, [organization]);

    const handlerSaveForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            status: status,
            internalNotes: notes
        };

        const updateOrgStatus = await api(`/orgs/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(payload),
        })

        console.log("updateOrgStatus:", updateOrgStatus)

        if (updateOrgStatus) {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-6">Loading organization...</div>;
    if (!organization) return <div className="p-6 text-red-500">Organization not found.</div>;

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1">
                <header
                    className="flex items-center justify-between p-6 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Verification</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Verify compliance documents and manage
                            organization status.</p>
                    </div>
                </header>
                <div className="flex p-6 gap-6">
                    <div className="flex-1 space-y-6">
                        <div
                            className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization
                                Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div
                                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Organization Name</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{organization?.legalName}</p>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Registration Number</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{organization?.reraNumber}</p>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Email</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{organization?.email}</p>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Phone</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{organization?.phone}</p>
                                </div>
                                <div
                                    className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-800 col-span-1 md:col-span-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Office 101,
                                        Building A, Dubai, UAE</p>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">KYC Documents</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document
                                            Type
                                        </th>
                                        {/*<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>*/}
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {organization.tradeLicense && (
                                        <tr>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">Trade
                                                License
                                            </td>
                                            {/*<td className="px-4 py-4 whitespace-nowrap text-sm">*/}
                                            {/*<span*/}
                                            {/*    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</span>*/}
                                            {/*</td>*/}
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a
                                                    href={organization.tradeLicense.url}
                                                    download={organization.tradeLicense.filename}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary/80 flex items-center justify-end gap-1">
                                                    <span>Download</span>
                                                    <span
                                                        className="material-symbols-outlined text-base">download</span>
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                    {organization.reraCertificate && (
                                        <tr>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">RERA
                                                Certificate
                                            </td>
                                            {/*<td className="px-4 py-4 whitespace-nowrap text-sm">*/}
                                            {/*<span*/}
                                            {/*    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending Review</span>*/}
                                            {/*</td>*/}
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a
                                                    href={organization.reraCertificate.url}
                                                    download={organization.reraCertificate.filename}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-primary/80 flex items-center justify-end gap-1">
                                                    <span>Download</span>
                                                    <span
                                                        className="material-symbols-outlined text-base">download</span>
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                    {/*<tr>*/}
                                    {/*    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">Bank*/}
                                    {/*        Statement*/}
                                    {/*    </td>*/}
                                    {/*    <td className="px-4 py-4 whitespace-nowrap text-sm">*/}
                                    {/*        <span*/}
                                    {/*            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</span>*/}
                                    {/*    </td>*/}
                                    {/*    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">*/}
                                    {/*        <a className="text-primary hover:text-primary/80 flex items-center justify-end gap-1"*/}
                                    {/*           href="#">*/}
                                    {/*            <span>Download</span>*/}
                                    {/*            <span className="material-symbols-outlined text-base">download</span>*/}
                                    {/*        </a>*/}
                                    {/*    </td>*/}
                                    {/*</tr>*/}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div
                            className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Branches
                                Summary</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                    <thead className="bg-slate-100/50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            scope="col">Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            scope="col">Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400"
                                            scope="col">Address
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody
                                        className="divide-y divide-slate-200 bg-background-light dark:divide-slate-800 dark:bg-background-dark">
                                    {brokers.map((broker) => (
                                        <tr key={broker.id}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {broker.name || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {broker.phone || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {broker.address || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handlerSaveForm} className="w-96 space-y-6 flex-shrink-0">
                        <div
                            className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Organization
                                Status</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update the organization&#39;s
                                status based on compliance review.</p>
                            <div className="space-y-3">
                                <label
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary dark:has-[:checked]:bg-primary/20 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="PENDING_REVIEW"
                                        checked={status === "PENDING_REVIEW"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="form-radio text-primary focus:ring-primary/50"
                                    />
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Pending Review</span>
                                </label>

                                <label
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary dark:has-[:checked]:bg-primary/20 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="ACTIVE"
                                        checked={status === "ACTIVE"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="form-radio text-primary focus:ring-primary/50"
                                    />
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Active</span>
                                </label>

                                <label
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 has-[:checked]:bg-primary/10 has-[:checked]:border-primary dark:has-[:checked]:bg-primary/20 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="SUSPENDED"
                                        checked={status === "SUSPENDED"}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="form-radio text-primary focus:ring-primary/50"
                                    />
                                    <span
                                        className="text-sm font-medium text-gray-800 dark:text-gray-200">Suspended</span>
                                </label>
                            </div>

                        </div>
                        <div
                            className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Internal Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value)
                                }}
                                className="form-textarea w-full rounded border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:border-primary focus:ring-primary/50 placeholder-gray-400 dark:placeholder-gray-500 min-h-[120px] text-sm"
                                placeholder="Add internal notes for the team..."></textarea>
                        </div>
                        <button
                            className="w-full flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90">
                            Update Status
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}