import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface CaseBuyerFormProps {
    caseId: string;
    mortgageToEdit?: any | null;
    onSuccess?: () => void;
}

export default function CaseMortgageForm({caseId, mortgageToEdit, onSuccess}: CaseBuyerFormProps) {
    const [role] = useState("BUYER");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const [results, setResults] = useState<any[]>([]);


    // 🧠 Debounce user typing (avoid too many requests)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (email.length >= 3) {
                searchParties(email);
            } else {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [email]);

    const searchParties = async (email: string) => {
        setLoading(true);
        setError("");
        setResults([]); // Clear old results first

        // 🚫 Check if email input is empty
        if (!email.trim()) {
            setLoading(false);
            setError("No email found");
            return;
        }

        try {
            const response = await api(`/users/search/MORTGAGE_BROKER?email=${encodeURIComponent(email)}`, {
                method: "GET",
            });

            if (response.ok) {
                const data = response?.results?.data || [];

                if (data.length === 0) {
                    setError("No user found with this email");
                }

                setResults(data);
            } else {
                setError("Error: " + (response.results?.message || "Something went wrong"));
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Prefill data when editing
    useEffect(() => {
        if (mortgageToEdit) {
            setName(mortgageToEdit.name || "");
            setEmail(mortgageToEdit.user?.email || mortgageToEdit.email || "");
            setPhoneNumber(mortgageToEdit.phone || "");
        } else {
            setName("");
            setEmail("");
            setPhoneNumber("");
        }
    }, [mortgageToEdit]);

    const handleSaveForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = {role, name, email, phone: phoneNumber};

        try {
            const method = mortgageToEdit ? "PATCH" : "POST";
            const url = mortgageToEdit
                ? `/cases/${caseId}/parties/${mortgageToEdit.id}`
                : `/cases/${caseId}/parties`;

            const response = await api(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success(`Buyer ${mortgageToEdit ? "updated" : "created"} successfully`);
                onSuccess?.(); // refresh parent table
            } else {
                toast.error("Error: " + response.results?.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSaveForm} className="bg-white dark:bg-slate-800 rounded-lg p-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Email */}
                <div>
                    <div className="flex flex-col">
                        <label className="text-[#0d171b] dark:text-slate-50 text-base font-medium leading-normal pb-2"
                               htmlFor="email">Email Address</label>
                        <div className="relative">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d171b] dark:text-slate-50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#cfdfe7] dark:border-slate-600 bg-background-light dark:bg-slate-700 h-14 placeholder:text-[#4c809a] dark:placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
                                id="email" placeholder="e.g., john.smith@example.com" type="email"/>
                        </div>
                    </div>
                    {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                    {/* Autocomplete dropdown */}
                    {results.length > 0 && (
                        <ul className="mt-2 border rounded-md shadow bg-white divide-y">
                            {results.map((item) => (
                                <li
                                    key={item.id || item.email}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setEmail(item.email);
                                        setResults([]); // 👈 hide dropdown after selection
                                    }}
                                >
                                    <div className="font-medium">{item.email}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.name || "Unknown Email Address"}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                    <label className="text-base font-medium pb-2 text-[#0d171b] dark:text-slate-50">
                        Full Name
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="form-input border rounded-lg h-14 p-3"
                        placeholder="e.g., John Smith"
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                    <label className="text-base font-medium pb-2 text-[#0d171b] dark:text-slate-50">
                        Phone Number
                    </label>
                    <input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="tel"
                        className="form-input border rounded-lg h-14 p-3"
                        placeholder="e.g., +971 50 123 4567"
                    />
                </div>
            </div>

            <div className="flex justify-end items-center pt-6 mt-6">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary/90 font-bold text-sm"
                >
                    {loading ? "Saving..." : mortgageToEdit ? "Edit Buyer" : "Add Buyer"}
                </button>
            </div>
        </form>
    );
}