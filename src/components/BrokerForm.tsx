"use client";

import {useState, useEffect} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

interface Branch {
    id: string;
    name: string;
}

interface BrokerFormProps {
    initialValues?: {
        id?: string;
        branchId?: string;
        emails?: string[];
    };
    onSubmit: (values: { branchId: string; emails: string[] }) => Promise<void>;
    loading: boolean;
}

export default function BrokerForm({initialValues, onSubmit, loading}: BrokerFormProps) {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [selectedBranch, setSelectedBranch] = useState(initialValues?.branchId || "");
    const [emails, setEmails] = useState<string[]>(initialValues?.emails || [""]);

    // ✅ Load user safely from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem("user");
        }
    }, []);

    // ✅ Fetch branches when user is known
    useEffect(() => {
        if (!user?.managedOrgId) return;

        (async () => {
            try {
                const res = await api(`/orgs/${user.managedOrgId}/branches`, {method: "GET"});
                const data = Array.isArray(res?.results?.data) ? res.results.data : res?.results || [];
                setBranches(data);
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        })();
    }, [user]);

    // ✅ Refill form if initialValues change (edit mode)
    useEffect(() => {
        if (initialValues) {
            setSelectedBranch(initialValues.branchId || "");
            setEmails(initialValues.emails?.length ? initialValues.emails : [""]);
        }
    }, [initialValues]);

    // ✅ Email Handlers
    const addEmail = () => setEmails([...emails, ""]);
    const removeEmail = (index: number) => setEmails(emails.filter((_, i) => i !== index));
    const handleEmailChange = (index: number, value: string) => {
        const newEmails = [...emails];
        newEmails[index] = value;
        setEmails(newEmails);
    };

    // ✅ Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBranch) return toast.error("Please select a branch.");
        if (emails.some((email) => !email.trim())) return toast.error("Please fill in all email fields.");

        await onSubmit({branchId: selectedBranch, emails});
    };

    const isFormReady = branches.length > 0 || !user?.managedOrgId;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Branch Assignment */}
            <h3 className="text-lg font-bold text-[#111418] dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-2">
                Branch Assignment
            </h3>

            <div className="relative flex flex-col min-w-40 flex-1">
                <label
                    htmlFor="branchAssignment"
                    className="text-[#111418] dark:text-gray-200 text-sm font-medium leading-normal pb-2"
                >
                    Select Branch
                </label>

                <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            domain
          </span>
                    <select
                        id="branchAssignment"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        disabled={!isFormReady}
                        className="form-select flex w-full min-w-0 flex-1 appearance-none overflow-hidden rounded-lg
              text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50
              border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark
              h-12 pl-10 pr-10 text-base font-normal leading-normal disabled:opacity-50"
                        required
                    >
                        <option value="">
                            {isFormReady ? "Select Branch" : "Loading branches..."}
                        </option>
                        {branches.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    <span
                        className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            unfold_more
          </span>
                </div>
            </div>

            {/* Broker Emails */}
            <h3 className="text-lg font-bold text-[#111418] dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-2 mt-4">
                Broker Emails
            </h3>

            <div className="flex flex-col gap-4" id="broker-emails-container">
                {emails.map((email, i) => (
                    <div key={i} className="relative flex items-center gap-2">
                        <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                mail
              </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => handleEmailChange(i, e.target.value)}
                                placeholder="Enter broker's email address"
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg
                  text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50
                  border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark
                  h-12 placeholder:text-[#617589] dark:placeholder:text-gray-500 pl-12 pr-4 text-base font-normal leading-normal"
                                required
                            />
                        </div>

                        {emails.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeEmail(i)}
                                className="flex items-center justify-center size-10 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addEmail}
                className="flex items-center justify-center gap-2 self-start rounded-lg h-10 px-4 text-primary text-sm font-bold leading-normal hover:bg-primary/10 dark:hover:bg-primary/20"
            >
                <span className="material-symbols-outlined">add_circle</span>
                <span className="truncate">Add another broker</span>
            </button>

            {/* Actions */}
            <div
                className="flex items-center justify-end gap-4 pt-8 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="flex min-w-[84px] items-center justify-center rounded-lg h-11 px-6 bg-transparent
            text-gray-600 dark:text-gray-300 text-sm font-bold border border-gray-300 dark:border-gray-600
            hover:bg-gray-100 dark:hover:bg-gray-700/50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex min-w-[84px] items-center justify-center rounded-lg h-11 px-6 bg-primary
            text-white text-sm font-bold hover:bg-primary/90 disabled:bg-primary/50"
                >
                    {loading
                        ? "Saving..."
                        : initialValues
                            ? "Update Broker"
                            : "Save Brokers"}
                </button>
            </div>
        </form>
    );
}
