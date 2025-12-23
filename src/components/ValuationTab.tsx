import {FormEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {api} from "@/lib/api";

interface OffersTabProps {
    caseId: string | null;
    setIsLoading: (isLoading: boolean) => void;
}

interface Valuation {
    id: string;
    requestedBy: string;
    status: string;
    bankId: string;
    bank: {
        name: string;
    };
}

function ValuationTab({caseId, setIsLoading}: OffersTabProps) {
    const [valuation, setValuation] = useState<Valuation | null>(null);
    const [status, setStatus] = useState("PENDING");

    useEffect(() => {
        const fetchMortgage = async () => {
            setIsLoading(true);
            try {
                const response = await api(`/cases/${caseId}/mortgage/valuation`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = response.results?.data;
                    setValuation(Array.isArray(data) ? data[0] : data);
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMortgage();
    }, [caseId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            status,
            bankId: valuation?.bankId ?? null,
            requestedBy: valuation?.requestedBy ?? null
        };

        try {
            const response = await api(`/cases/${caseId}/mortgage/valuation`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("Successfully updated valuation");
            } else {
                toast.error("Error: " + response.results?.message);
            }
        } catch (e) {
            toast.error("Error: " + e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
                {/* LEFT SIDE (8 parts) */}
                <div className="md:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Bank Details */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Bank Details
                            </h2>
                            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                                <div
                                    className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <svg
                                        fill="currentColor"
                                        height="28px"
                                        width="28px"
                                        viewBox="0 0 256 256"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Name</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {valuation?.bank?.name ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Date
                            </h2>

                            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                                <div
                                    className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <svg
                                        fill="currentColor"
                                        height="28px"
                                        width="28px"
                                        viewBox="0 0 256 256"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91h0a36,36,0,0,1-50.92,50.91ZM56,76A20,20,0,1,0,90.14,61.84h0A20,20,0,0,0,56,76ZM216,180a36,36,0,1,1-10.54-25.46h0A35.76,35.76,0,0,1,216,180Zm-16,0a20,20,0,1,0-5.86,14.14A19.87,19.87,0,0,0,200,180Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Requested
                                        Date</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {valuation?.requestedBy
                                            ? new Date(valuation.requestedBy).toLocaleDateString("en-GB")
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Status
                            </h2>
                            <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                                <div
                                    className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                                    <svg
                                        fill="currentColor"
                                        height="28px"
                                        width="28px"
                                        viewBox="0 0 256 256"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Application
                                        Status</p>
                                    <p
                                        className={`text-lg font-semibold ${
                                            valuation?.status === "completed"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-yellow-600 dark:text-yellow-400"
                                        }`}
                                    >
                                        {valuation?.status ?? "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="md:col-span-2">
                    <div
                        className="bg-white dark:bg-background-dark/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Update Status
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="flex flex-col">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select Status
                                </p>
                                <select
                                    className="rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-background-dark dark:text-white"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="PENDING">PENDING</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </label>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-semibold text-sm"
                            >
                                Update Status
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ValuationTab;