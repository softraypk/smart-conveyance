import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {type} from "node:os";

interface Props {
    caseId: string | null;
    open: boolean;
    onClose: () => void;
}

export default function CaseUpdateStatusModel({caseId, open, onClose}: Props) {
    const [cases, setCases] = useState<any | null>(null);
    const [propType, setPropType] = useState("SALE")
    const [status, setStatus] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!open || !caseId) return;

        const loadCase = async () => {
            try {
                const response = await api(`/cases/${caseId}`, {method: "GET"});

                if (response.ok) {
                    setCases(response.results?.data);
                    setPropType(response.results?.data?.type)
                    setDescription(response.results?.data?.description)
                    setStatus(response.results?.data?.status)
                } else {
                    toast.error("Error: " + (response.results?.message || "Unable to fetch case"));
                }
            } catch (e) {
                toast.error("Error: " + e);
            }
        };

        loadCase();
    }, [open, caseId]);

    const handleUpdateCase = async (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            type: propType,
            description: description,
            status: status
        };
        try {
            const response = await api(`/cases/${caseId}`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success(response.results?.message);
            } else {
                toast.error(response.results?.message)
            }
        } catch (e) {
            toast.error("Error: " + e);
        }
    }

    if (!open) return null;
    return (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
            <div
                className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div
                    className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-200 dark:border-slate-800">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-8">Case
                        Details</h2>
                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Property Address</label>
                            <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-100">
                                <div
                                    className="w-10 h-10 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-center">
                                    <span className="material-icons-outlined text-slate-400">home</span>
                                </div>
                                <span
                                    className="text-lg font-semibold">{cases?.property?.community || "Loading..."} {cases?.property?.unit || "Loading..."}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Assigned Conveyance</label>
                            <div className="flex items-center space-x-3 text-slate-800 dark:text-slate-100">
                                <img alt="Admin Avatar"
                                     className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                                     src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5ZITgWDJXpPsQLpbDFmKrrEXnXanH-8dpFiSlDh0RGIxxf0lUvUCvhXBP_qBuaZG7tI20u6UCrpIRqpMkOZjfYGOzY1j6y5fY0QnGe9x5yhXLh3P82XezR16r4vkEDdf-4kDVOanU0Xl8VcQOHZduFR7d60EurmwYivE4bmh1VFThJFkLgPAC7Px1i0FbLVlFrgexG83z2KRi6zxky3fXLiMb2Fpdg0mbr7RHzUNrRAedNCTRfwSq91vsgLYN5fgXwQsIVhL3BqA"
                                />
                                <div>
                                    <p className="text-sm font-semibold leading-none">{cases?.createdByUser?.name || "Loading..."}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{cases?.createdByUser?.role || "Conveyance"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                            <div
                                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                <div className="flex space-x-3">
                                    <span className="material-icons-outlined text-blue-500 text-xl">info</span>
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">Workflow
                                            Impact</h4>
                                        <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-400/80">
                                            Changing the case status or details may trigger automated notifications to
                                            brokers and clients. Ensure all required documentation is verified before
                                            proceeding.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-8">
                    <form className="space-y-6" onSubmit={handleUpdateCase}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Case Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={propType}
                                onChange={e => setPropType(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                <option value="SALE">SALE</option>
                                <option value="LEASE">LEASE</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Enter case description and relevant legal notes..."
                                    rows={6}></textarea>
                                <div
                                    className="text-right text-[10px] font-bold text-slate-400 mt-1 tracking-wider uppercase">
                                    0 / 500 characters
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                <option value="DRAFT">DRAFT</option>
                                <option value="COMPLIANCE_READY">COMPLIANCE_READY</option>
                                <option value="FINALIZED">FINALIZED</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>
                        <div className="pt-6 flex items-center justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                type="button">
                                Cancel
                            </button>
                            <button
                                className="px-8 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 shadow-md transition-all"
                                type="submit">
                                Update Case
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}