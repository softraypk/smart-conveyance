"use client";

import {useState, useEffect, FormEvent} from "react";
import {api} from "@/lib/api";
import {useParams, useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function CasePropertyForm() {
    const router = useRouter();
    const {id} = useParams();

    const [emirate, setEmirate] = useState("");
    const [community, setCommunity] = useState("");
    const [unit, setUnit] = useState("");
    const [building, setBuilding] = useState("");
    const [titleDeedNo, setTitleDeedNo] = useState("");
    const [hasMortgage, setHasMortgage] = useState(false);

    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [propertyId, setPropertyId] = useState<string | null>(null);

    const emirates = [
        {value: "ABU_DHABI", label: "Abu Dhabi"},
        {value: "DUBAI", label: "Dubai"},
        {value: "SHARJAH", label: "Sharjah"},
        {value: "AJMAN", label: "Ajman"},
        {value: "UMM_AL_QUWAIN", label: "Umm Al Quwain"},
        {value: "RAS_AL_KHAIMAH", label: "Ras Al Khaimah"},
        {value: "FUJAIRAH", label: "Fujairah"},
    ];

    // 🧠 Fetch property if case already has one
    useEffect(() => {
        if (id) {
            fetchCaseProperty(id as string);
        }
    }, [id]);

    const fetchCaseProperty = async (caseId: string) => {
        try {
            setLoading(true);
            const response = await api(`/cases/${caseId}`, {method: "GET"});
            if (response.ok && response.results?.data) {
                const data = response.results.data;
                console.log(data);
                setPropertyId(data.property?.id || null);
                setEmirate(data.property?.emirate || "");
                setCommunity(data.property?.community || "");
                setUnit(data.property?.unit || "");
                setBuilding(data.property?.building || "");
                setTitleDeedNo(data.property?.titleDeedNo || "");
                setHasMortgage(!!data.property?.hasMortgage);
            }
        } catch (err) {
            console.error("Error fetching property:", err);
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Debounced search for properties by title deed
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (titleDeedNo.length >= 3) {
                searchProperties(titleDeedNo);
            } else {
                setResults([]);
            }
        }, 400);
        return () => clearTimeout(timeout);
    }, [titleDeedNo]);

    const searchProperties = async (titleDeedNo: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await api(`/cases/properties/search?titleDeedNo=${encodeURIComponent(titleDeedNo)}`, {
                method: "GET",
            });
            if (response.ok) {
                setResults(response?.results?.data || []);
            } else {
                setError("Error: " + response.results?.message);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    // 🧠 Save or update form
    const handleSaveForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            emirate,
            community,
            unit,
            building,
            titleDeedNo,
            hasMortgage,
        };

        try {
            const method = propertyId ? "PATCH" : "POST";
            const url = propertyId
                ? `/cases/${id}/properties/${propertyId}`
                : `/cases/${id}/properties`;

            const response = await api(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success(propertyId ? "Property updated successfully" : "Property saved successfully");
                router.push(propertyId ? `/cases/${id}/buyer` : `/cases/new/${id}/buyer`);
            } else {
                toast.error("Error: " + response.results?.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="p-4 space-y-6" onSubmit={handleSaveForm}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                <div>
                    <label className="flex flex-col md:col-span-2">
                        <p className="form-label dark:text-gray-300">Title Deed Number*</p>
                        <div className="relative">
                            <input
                                type="text"
                                value={titleDeedNo}
                                onChange={(e) => setTitleDeedNo(e.target.value)}
                                className="form-input w-full dark:bg-background-dark dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter Title Deed Number"
                            />
                            <span
                                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                data-icon="info"
                            >
                                info
                            </span>
                        </div>
                    </label>
                    {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                    {results.length > 0 && (
                        <ul className="mt-2 border rounded-md shadow bg-white divide-y">
                            {results.map((item) => (
                                <li
                                    key={item.id || item.titleDeedNo}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => setTitleDeedNo(item.titleDeedNo)}
                                >
                                    <div className="font-medium">{item.titleDeedNo}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.building || "Unknown Building"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col">
                    <p className="form-label dark:text-gray-300">Emirate*</p>
                    <select
                        value={emirate}
                        onChange={(e) => setEmirate(e.target.value)}
                        className="form-input w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-background-dark dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Select Emirate</option>
                        {emirates.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col">
                    <p className="form-label dark:text-gray-300">Community*</p>
                    <input
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white"
                        placeholder="Enter Community"
                    />
                </label>

                <label className="flex flex-col">
                    <p className="form-label dark:text-gray-300">Building Name/Number*</p>
                    <input
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white"
                        placeholder="Enter Building Name/Number"
                    />
                </label>

                <label className="flex flex-col">
                    <p className="form-label dark:text-gray-300">Unit Number*</p>
                    <input
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white"
                        placeholder="Enter Unit Number"
                    />
                </label>
            </div>

            <div className="flex items-center justify-between py-4">
                <label className="form-label dark:text-gray-300 mb-0" htmlFor="mortgage-toggle">
                    Does this property have a mortgage?
                </label>
                <label className="toggle-switch">
                    <input
                        checked={hasMortgage}
                        onChange={(e) => setHasMortgage(e.target.checked)}
                        id="mortgage-toggle"
                        type="checkbox"
                    />
                    <span className="slider"></span>
                </label>
            </div>

            <div className="flex justify-between items-center pt-6">
                <button
                    type="button"
                    onClick={() => router.push(`/cases/new/${id}`)}
                    className="px-6 py-3 rounded-lg text-[#4c809a] dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-sm"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary/90 font-bold text-sm"
                >
                    Next: Client Details
                </button>
            </div>
        </form>
    );
}