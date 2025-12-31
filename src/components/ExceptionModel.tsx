"use client";
import {FormEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {api} from "@/lib/api";
import Image from "next/image";

interface Props {
    caseId: string | null;
    open: boolean;
    onClose: () => void;
}

export default function ExceptionModal({caseId, open, onClose}: Props) {
    const [cases, setCases] = useState<any | null>(null);
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!open || !caseId) return;

        const loadCase = async () => {
            try {
                const response = await api(`/cases/${caseId}`, {method: "GET"});

                if (response.ok) {
                    setCases(response.results?.data);
                } else {
                    toast.error("Error: " + (response.results?.message || "Unable to fetch case"));
                }
            } catch (e) {
                toast.error("Error: " + e);
            }
        };

        loadCase();
    }, [open, caseId]);

    const handleException = async (e: FormEvent) => {
        e.preventDefault();
        const payload = {
            caseId: caseId,
            description: description,
            type: type
        };
        try {
            const response = await api('/exceptions', {
                method: "POST",
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-lg shadow-card border border-border-gray w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col lg:flex-row">
                    {/* LEFT SIDE */}
                    <div
                        className="w-full lg:w-1/3 bg-gray-50 border-b lg:border-b-0 lg:border-r border-border-gray p-6 lg:p-8">

                        <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider mb-6">
                            Case Details
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-text-sub mb-1">
                                    Property Address
                                </label>
                                <div className="flex items-center gap-2 text-text-main font-medium">
                                    <span className="material-symbols-outlined text-gray-400 text-[20px]">home</span>
                                    {/* Show API data if available */}
                                    {cases?.property?.community || "Loading..."} {cases?.property?.unit || "Loading..."}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-text-sub mb-1">
                                    Assigned Conveyance
                                </label>

                                <div className="flex items-center gap-3 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        <Image
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh2XxtgOhS_kz2KaTg8MB9jx6hcePmu_xFoLd-LNxuTG6zLrkz0J3e58oasODY9sVYowcZZpvAN_KfYrVpiyCJXuiMaMayzkInXRU_q5j7olGgbaizxtmBnAWFR0L1h0mlhtt68oFefMd09yV2jPEAPs1sqUQ4p-aD-ib9NDkpGwbhQTL6MYBc5trj7V7Vaqk1zOi127f8DaffPyd_eb-nSpv41nmFS2pbe5_9vRAtRJz1w4DNTZiIDklK3CAQL_AwytqQe9h7vzHK"
                                            alt="User avatar"
                                            width={128}   // set desired width
                                            height={128}  // set desired height
                                            className="object-cover w-full h-full rounded-full"
                                        />
                                    </div>


                                    <div>
                                        <p className="text-sm font-medium text-text-main">
                                            {cases?.createdByUser?.name || "Loading..."}
                                        </p>
                                        <p className="text-xs text-text-sub">
                                            {cases?.createdByUser?.role || "Conveyance"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="pt-6 border-t border-border-gray">
                                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-brand-blue text-[20px] mt-0.5">
                                            info
                                        </span>

                                        <div>
                                            <h4 className="text-sm font-semibold text-brand-blue mb-1">
                                                Workflow Impact
                                            </h4>

                                            <p className="text-xs text-blue-800 leading-relaxed">
                                                Logging this exception will immediately halt all automated tasks for
                                                this case. The broker and client will be notified automatically.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex-1 p-6 lg:p-8">
                        <form className="space-y-6 max-w-2xl" onSubmit={handleException}>

                            {/* EXCEPTION CATEGORY */}
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-1.5">
                                    Exception Category <span className="text-red-500">*</span>
                                </label>

                                <select value={type} onChange={(e) => setType(e.target.value)}
                                        className="block w-full rounded-md border-border-gray text-sm text-text-main shadow-sm py-2.5 pl-3 pr-10 focus:border-brand-blue focus:ring-brand-blue">
                                    <option value="DOCUMENT_MISSING">Document Missing</option>
                                    <option value="PAYMENT_OVERDUE">Payment Over Due</option>
                                    <option value="APPROVAL_PENDING">Approval Pending</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* PRIORITY */}
                            {/*<div>*/}
                            {/*    <label className="block text-sm font-medium text-text-main mb-2">*/}
                            {/*        Priority Level*/}
                            {/*    </label>*/}

                            {/*    <div className="flex flex-wrap gap-3">*/}

                            {/*        /!* LOW *!/*/}
                            {/*        <label className="cursor-pointer">*/}
                            {/*            <input type="radio" name="priority" value="low" className="peer sr-only"/>*/}
                            {/*            <div*/}
                            {/*                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white peer-checked:border-green-500 peer-checked:text-green-700 peer-checked:bg-green-50 flex items-center gap-2">*/}
                            {/*                <span className="w-2 h-2 rounded-full bg-green-500"/> Low*/}
                            {/*            </div>*/}
                            {/*        </label>*/}

                            {/*        /!* MEDIUM *!/*/}
                            {/*        <label className="cursor-pointer">*/}
                            {/*            <input type="radio" name="priority" value="medium" defaultChecked*/}
                            {/*                   className="peer sr-only"/>*/}
                            {/*            <div*/}
                            {/*                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white peer-checked:border-orange-400 peer-checked:text-orange-700 peer-checked:bg-orange-50 flex items-center gap-2">*/}
                            {/*                <span className="w-2 h-2 rounded-full bg-orange-400"/> Medium*/}
                            {/*            </div>*/}
                            {/*        </label>*/}

                            {/*        /!* CRITICAL *!/*/}
                            {/*        <label className="cursor-pointer">*/}
                            {/*            <input type="radio" name="priority" value="critical" className="peer sr-only"/>*/}
                            {/*            <div*/}
                            {/*                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white peer-checked:border-red-500 peer-checked:text-red-700 peer-checked:bg-red-50 flex items-center gap-2">*/}
                            {/*                <span className="w-2 h-2 rounded-full bg-red-500"/> Critical*/}
                            {/*            </div>*/}
                            {/*        </label>*/}

                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-sm font-medium text-text-main mb-1.5">
                                    Incident Description <span className="text-red-500">*</span>
                                </label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                                          className="block w-full rounded-md border-border-gray text-sm text-text-main shadow-sm py-3 px-3 min-h-[140px] focus:border-brand-blue focus:ring-brand-blue"
                                />
                                <p className="text-xs text-text-sub mt-1 text-right">0/500 characters</p>
                            </div>

                            {/* FILE UPLOAD */}
                            {/*<div>*/}
                            {/*    <label className="block text-sm font-medium text-text-main mb-1.5">*/}
                            {/*        Supporting Documents*/}
                            {/*    </label>*/}

                            {/*    <div*/}
                            {/*        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-gray border-dashed rounded-md hover:bg-gray-50 cursor-pointer">*/}
                            {/*        <div className="space-y-1 text-center">*/}
                            {/*            <span*/}
                            {/*                className="material-symbols-outlined text-gray-400 text-[32px]">cloud_upload</span>*/}
                            {/*            <div className="flex text-sm text-text-sub justify-center">*/}
                            {/*                <label className="relative cursor-pointer text-brand-blue font-medium">*/}
                            {/*                    <span>Upload a file</span>*/}
                            {/*                    <input type="file" className="sr-only"/>*/}
                            {/*                </label>*/}
                            {/*                <p className="pl-1">or drag and drop</p>*/}
                            {/*            </div>*/}
                            {/*            <p className="text-xs text-text-sub">PDF, PNG, JPG up to 10MB</p>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* BUTTONS */}
                            <div className="pt-6 border-t border-border-gray flex items-center justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-medium text-text-main bg-white border border-border-gray hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Create Exception
                                </button>

                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}