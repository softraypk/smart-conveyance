"use client";

import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

type Props = {
    id?: string | null;
    loading: boolean;
    setLoading: (value: boolean) => void;
};

interface Case {
    id: string;
    property: {
        titleDeedNo: string
    };
}


export default function MortgageForm({id, loading, setLoading}: Props) {
    const [bankId, setBankId] = useState("");
    const [mortgage, setMortgage] = useState<Case[]>([]);
    const [amount, setAmount] = useState<number | string>("");
    const [rate, setRate] = useState<number | string>("");
    const [tenure, setTenure] = useState<number | string>("");
    const [cases, setCases] = useState<Case[]>([]);
    const [caseId, setCaseId] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [banks, setBanks] = useState<any[]>([]);


    const router = useRouter();

    console.log(id)
    // 🧠 Fetch banks list from API
    useEffect(() => {
        setLoading(true);
        const fetchBanks = async () => {
            try {
                const response = await api("/admins/banks", {method: "GET"});
                if (response.ok) {
                    setBanks(response.results || []);
                } else {
                    toast.error(response.results?.message || "Failed to load banks");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading banks");
            }
        };
        fetchBanks();

        const fetchCases = async () => {
            try {
                const response = await api("/cases?mortgageStatus=BROKER_CREATED", {method: "GET"});
                if (response.ok) {
                    setCases(response.results.data?.cases || []);
                } else {
                    toast.error(response.results?.message || "Failed to load banks");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading banks");
            }
        };

        fetchCases();
        setLoading(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        try {
            const fetchMortgage = async () => {
                const response = await api(`/cases/${id}/mortgage`, {method: "GET"});

                if (response.ok) {
                    setBankId(response.results.data?.bank?.id || []);
                    setAmount(response.results.data?.amount || 0);
                    setRate(response.results.data?.rate || 0);
                    setTenure(response.results.data?.tenure || 0);
                    setStatus(response.results.data?.status || 0);
                }
            }
            fetchMortgage();
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [id]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!bankId || !amount || !rate || !tenure) {
            toast.error("Please fill in all fields");
            return;
        }

        const payload = {
            bankId,
            amount: Number(amount),
            rate: Number(rate),
            tenure: Number(tenure),
            status,
        };

        try {
            setLoading(true);
            const response = await api(`/cases/${id ? id : caseId}/mortgage`, {
                method: (id) ? "PATCH" : "POST",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("Mortgage Application Created Successfully");
                setBankId("");
                setAmount("");
                setRate("");
                setTenure("");
                setStatus("PENDING");
                router.push("/mortgages");
            } else {
                toast.error(response.results?.message || "Failed to create application");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong" + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* CASE Selection */}
            {!id && (
                <div>
                    <label
                        htmlFor="case"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                        Case#
                    </label>
                    <select
                        id="case"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700
            bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
            text-slate-800 dark:text-slate-200"
                    >
                        <option value="">Select Case#</option>
                        {cases.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.property?.titleDeedNo}
                            </option>
                        ))}
                    </select>
                </div>
            )}


            {/* Bank Selection */}
            <div>
                <label
                    htmlFor="bank"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                    Bank
                </label>
                <select
                    id="bank"
                    value={bankId}
                    onChange={(e) => setBankId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
                text-slate-800 dark:text-slate-200"
                >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Amount */
            }
            <div>
                <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                    Loan Amount (AED)
                </label>
                <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter loan amount"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
                text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {/* Rate */
            }
            <div>
                <label
                    htmlFor="rate"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                    Interest Rate (%)
                </label>
                <input
                    id="rate"
                    type="number"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="e.g. 3.25"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
                text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {/* Tenure */
            }
            <div>
                <label
                    htmlFor="tenure"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                    Tenure (Months)
                </label>
                <input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="Enter number of months"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
                text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                />
            </div>

            {/* Status */
            }
            <div>
                <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700
                bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary
                text-slate-800 dark:text-slate-200"
                >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="DECLINED">Declined</option>
                </select>
            </div>

            {/* Submit Button */
            }
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg
                hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                dark:focus:ring-offset-background-dark transition-all duration-300 ease-in-out"
                >
                    {loading ? "Submitting..." : "Create Application"}
                </button>
            </div>
        </form>
    )
}