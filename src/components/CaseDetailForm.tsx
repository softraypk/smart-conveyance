"use client";

import { useRouter, usePathname } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    phone: string;
    orgId: string;
    branchId: string;
    managedOrgId?: string;
}

interface CaseData {
    id: string;
    type: string;
    notes?: string;
}

export default function CaseDetailForm() {
    const [type, setType] = useState("SALE");
    const [notes, setNotes] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();
    const pathname = usePathname(); // e.g., /cases/new or /cases/2a28134b-a6b9-476c-b528-e917d7deb25c
    const segments = pathname.split("/").filter(Boolean);
    const caseId = segments.length === 2 && segments[1] !== "new" ? segments[1] : null;

    // Load user
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    // Fetch case data if editing
    useEffect(() => {
        const fetchCase = async () => {
            if (!caseId) {
                setLoading(false);
                return;
            }

            try {
                const res = await api(`/cases/${caseId}`, { method: "GET" });
                if (res.ok && res.results?.data) {
                    const data: CaseData = res.results.data;
                    setType(data.type || "SALE");
                    setNotes(data.notes || "");
                } else {
                    toast.error("Failed to load case details.");
                }
            } catch (err) {
                console.error("Error fetching case:", err);
                toast.error("Network error while loading case.");
            } finally {
                setLoading(false);
            }
        };

        fetchCase();
    }, [caseId]);

    const handleCaseForm = async (e: FormEvent) => {
        e.preventDefault();

        if (!user?.managedOrgId) {
            toast.error("Organization ID missing. Please re-login.");
            return;
        }

        setSubmitting(true);

        const payload = {
            type,
            notes,
        };

        try {
            const method = caseId ? "PATCH" : "POST";
            const endpoint = caseId
                ? `/cases/${caseId}`
                : `/cases/${user.managedOrgId}`;

            const res = await api(endpoint, {
                method,
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const newCaseId = res.results?.data?.id || caseId;
                toast.success(method === "POST" ? "Case created successfully!" : "Case updated successfully!");
                router.push(`/cases/${newCaseId}/property`);
            } else {
                toast.error(res.results?.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error submitting case:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 dark:text-gray-400">Loading case details...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleCaseForm}>
            {/* Section */}
            <section className="flex flex-col gap-8 py-8">
                {/* CASE DETAILS */}
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-3">
                        <label className="flex flex-col relative">
              <span className="pb-2 text-base font-medium text-[#0d171b] dark:text-gray-300">
                Case Type
              </span>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="form-select rounded-lg border border-[#cfdfe7] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary h-14 p-4"
                            >
                                <option value="">Select Case Type</option>
                                <option value="SALE">Sale</option>
                                <option value="LEASE">Purchase</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* CASE NOTES */}
                <div>
                    <div className="px-4 py-3">
                        <label className="flex flex-col">
              <span className="pb-2 text-base font-medium text-[#0d171b] dark:text-gray-300">
                Brief Case Description
              </span>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add initial notes or a brief description of the case..."
                                className="form-textarea rounded-lg border border-[#cfdfe7] dark:border-gray-700 bg-background-light dark:bg-background-dark focus:border-primary min-h-[120px] p-4"
                            ></textarea>
                        </label>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 px-4 py-6 mt-4 border-t border-[#cfdfe7] dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-lg px-6 py-3 text-base font-bold text-[#4c809a] dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition w-full sm:w-auto"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg px-6 py-3 text-base font-bold text-primary bg-primary/20 hover:bg-primary/30 transition w-full sm:w-auto disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save as Draft"}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg px-6 py-3 text-base font-bold text-white bg-primary hover:bg-primary/90 transition w-full sm:w-auto disabled:opacity-50"
                >
                    {submitting ? "Saving..." : "Save & Continue"}
                </button>
            </div>
        </form>
    );
}