"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useState, useEffect} from "react";

export default function Page() {
    const [templates, setTemplates] = useState<any[]>([]);
    const router = useRouter();

    // Fetch templates on component mount
    useEffect(() => {
        listTemplates();
    }, []);

    const listTemplates = async () => {
        try {
            const response = await api("/admin/email-templates", {method: "GET"});

            if (response.ok) {
                setTemplates(response.results?.data?.templates || []);
            } else {
                toast.error("Error: " + response.results?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch templates.");
        }
    };

    // Inside your component
    const toggleTemplateStatus = async (templateId: string, isActive: boolean) => {
        try {
            // Call the toggle API
            const res = await api(`/admin/email-templates/${templateId}/toggle-active`, {
                method: "PATCH",
                body: JSON.stringify({isActive: isActive}),
            });
            if (!res.ok) {
                toast.error("Error: " + res.results?.message);
            }
            // Update local state
            setTemplates((prev) =>
                prev.map((t) =>
                    t.id === templateId ? {...t, isActive: !t.isActive} : t
                )
            );
            toast.success("Template status updated");
        } catch (error) {
            console.error(error);
            toast.error("Could not update template status" + error);
        }
    };


    const handleDeletions = async (id: string) => {
        const response = await api(`/admin/email-templates/${id}`, {method: "DELETE"});
        if (response.ok) {
            router.push("/templates");
        } else {
            toast.error("Error: " + response.results.message)
        }
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">Email Templates</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Manage automated communication workflows and notifications
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/templates/new")}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <span className="material-icons-outlined text-[20px]">add</span>
                        Create New Template
                    </button>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Total Templates</p>
                        <p className="text-3xl font-bold dark:text-white">{templates.length}</p>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Active Templates</p>
                        <p className="text-3xl font-bold dark:text-white">{templates.filter(t => t.isActive).length}</p>
                    </div>
                    <div
                        className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">System Generated</p>
                        <p className="text-3xl font-bold text-red-500">{templates.filter(t => t.isSystemGenerated).length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div
                    className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-1 min-w-[300px]">
                        <span
                            className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 text-sm"
                            placeholder="Search templates by name or subject..."
                            type="text"
                            onChange={(e) => {
                                const search = e.target.value.toLowerCase();
                                setTemplates((prev) =>
                                    prev.filter(
                                        (t) =>
                                            t.name.toLowerCase().includes(search) ||
                                            t.subject.toLowerCase().includes(search)
                                    )
                                );
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">
                            <option>All Categories</option>
                            <option>Client Onboarding</option>
                            <option>Legal Notice</option>
                            <option>Invoicing</option>
                        </select>
                        <select
                            className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 px-4 py-2 text-slate-600 dark:text-slate-300">
                            <option>Status: All</option>
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                        <button
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <span className="material-icons-outlined text-[20px]">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Template Table */}
                <div
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Template
                                Name
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject
                                Line
                            </th>
                            {/*<th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>*/}
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last
                                Updated
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {templates.map((template) => (
                            <tr key={template.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="px-6 py-4">
                                    <div
                                        className="font-medium text-slate-900 dark:text-slate-100">{template.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">ID: {template.id.split("-")[0]}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 italic">{template.subject}</td>
                                {/*<td className="px-6 py-4">*/}
                                {/*    <span*/}
                                {/*        className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{template.category}</span>*/}
                                {/*</td>*/}
                                <td className="px-6 py-4">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            onChange={(e) =>
                                                toggleTemplateStatus(template.id, e.target.checked)}
                                            className="sr-only peer" type="checkbox"
                                            defaultChecked={template.isActive}
                                        />
                                        <div
                                            className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(template.updatedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                                            <span className="material-icons-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button
                                            onClick={() => router.push(`/templates/${template.id}/edit`)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                                            <span className="material-icons-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm("Are you sure you want to delete this template?")) {
                                                    handleDeletions(template.id);
                                                }
                                            }}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                                            <span className="material-icons-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div
                        className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium text-slate-900 dark:text-slate-200">1</span> to <span
                            className="font-medium text-slate-900 dark:text-slate-200">{templates.length}</span> of <span
                            className="font-medium text-slate-900 dark:text-slate-200">{templates.length}</span> results
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-400 cursor-not-allowed">Previous
                            </button>
                            <button
                                className="px-3 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}