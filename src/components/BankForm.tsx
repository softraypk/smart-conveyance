"use client";

import { useState, useEffect } from "react";

interface Bank {
    name: string;
    address: string;
    code: string;
}

interface Props {
    initialData?: Bank | null;
    onSubmit: (values: Bank) => void;
    loading?: boolean;
    isEditing?: boolean;
}

export default function BankForm({ initialData, onSubmit, loading, isEditing }: Props) {
    const [formData, setFormData] = useState<Bank>({
        name: "",
        address: "",
        code: "",
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
                <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Bank Name</p>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input flex w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-12 px-4 text-sm"
                        placeholder="Enter the full bank name"
                    />
                </label>
            </div>

            <div className="md:col-span-1">
                <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Bank Code</p>
                    <input
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="form-input flex w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 h-12 px-4 text-sm"
                        placeholder="e.g., CITIUS33"
                    />
                </label>
            </div>

            <div className="md:col-span-2">
                <label className="flex flex-col w-full">
                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Bank Address</p>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="form-textarea w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 min-h-[120px] p-4 text-sm"
                        placeholder="Enter the full address of the bank's main branch"
                    />
                </label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="h-11 px-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-6 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                >
                    {loading ? "Saving..." : isEditing ? "Update Bank" : "Add Bank"}
                </button>
            </div>
        </form>
    );
}