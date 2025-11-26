"use client";

import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";

interface InvoicePageProps {
    invoiceId: string | null;
    setIsLoading: (loading: boolean) => void;
}

export default function InvoiceForm({invoiceId, setIsLoading}: InvoicePageProps) {

    const router = useRouter();
    // STATE
    const [caseId, setCaseId] = useState<string>("");
    const [selectedCase, setSelectedCase] = useState<any>([]);

    const [partyId, setPartyId] = useState("");
    const [currency, setCurrency] = useState("AED");
    const [status, setStatus] = useState("DRAFT");
    const [dueDate, setDueDate] = useState("");

    const [cases, setCases] = useState<any[]>([]);
    const [parties, setParties] = useState<any[]>([]);

    const [items, setItems] = useState([
        {kind: "", amount: 0, quantity: 1, description: "", subtotal: 0},
    ]);

    useEffect(() => {
        const fetchCases = async () => {
            setIsLoading(true);
            try {
                const response = await api("/cases");

                if (response.ok) {
                    setCases(response.results?.data?.cases);
                }
            } catch (e) {
                toast.error("Failed loading cases");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCases();
    }, []);

    useEffect(() => {
        if (!invoiceId) return; // create mode

        const loadInvoice = async () => {
            setIsLoading(true);

            try {
                const res = await api(
                    `/invoices/${invoiceId}`,
                    {method: "GET"}
                );

                if (!res.ok) {
                    toast.error(res.results?.message || "Invoice not found");
                    return;
                }

                const data = res.results;

                // Populate fields
                setCaseId(data.caseId);
                setPartyId(data.partyId);
                setCurrency(data.currency);
                setStatus(data.status);
                setDueDate(data.dueDate?.split("T")[0] || "");

                setItems(
                    data.items.map((item: any) => ({
                        ...item,
                        amount: Number(item.amount),
                        quantity: Number(item.quantity),
                        subtotal: Number(item.amount) * Number(item.quantity),
                    }))
                );
            } catch (e) {
                toast.error("Error loading invoice");
            } finally {
                setIsLoading(false);
            }
        };

        loadInvoice();
    }, [invoiceId]);

    useEffect(() => {
        if (!caseId) return;
        const fetchCase = async () => {
            setIsLoading(true);
            try {
                const response = await api(`/cases/${caseId}`, {
                    method: "GET",
                })
                if (response.ok) {
                    setSelectedCase(response.results.data);
                } else {
                    toast.error("Error: " + response.results?.data?.message || "Invoice not found");
                }

            } catch (e) {
                toast.error("Failed: " + e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCase();
    }, [caseId]);

    // ---------------------------------------------
    // 3️⃣ PARTIES LIST FILTER
    // ---------------------------------------------
    useEffect(() => {
        const filtered =
            selectedCase?.parties?.filter(
                (p: any) =>
                    p.role.toUpperCase() === "BUYER" ||
                    p.role.toUpperCase() === "SELLER"
            ) || [];

        setParties(filtered);
    }, [selectedCase]);

    // ---------------------------------------------
    // ITEM HELPERS
    // ---------------------------------------------
    const addItem = () => {
        setItems([
            ...items,
            {kind: "", amount: 0, quantity: 1, description: "", subtotal: 0},
        ]);
    };

    const updateItem = (index: number, key: string, value: any) => {
        const updated = [...items];
        (updated[index] as any)[key] = value;
        updated[index].subtotal =
            Number(updated[index].amount) * Number(updated[index].quantity);
        setItems(updated);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // ---------------------------------------------
    // 4️⃣ SUBMIT FORM (CREATE / UPDATE)
    // ---------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!caseId) {
            toast.error("Case ID is required");
            return;
        }

        setIsLoading(true);

        const payload = {
            caseId,
            partyId,
            currency,
            status,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
            items: items.map((i) => ({
                ...i,
                amount: Number(i.amount),
                quantity: Number(i.quantity),
                subtotal: Number(i.amount) * Number(i.quantity),
            })),
        };

        try {
            const url = invoiceId
                ? `/invoices/${invoiceId}`
                : `/invoices`;

            const method = invoiceId ? "PATCH" : "POST";

            const response = await api(url, {
                method,
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success("Invoice saved");
                router.push('/invoices');
            } else {
                toast.error(response.results?.message || "Failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedCase) {
        console.log(selectedCase);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="caseid"
                        >
                            CASE ID
                        </label>
                        <select
                            id="caseid"
                            value={caseId || ""}
                            onChange={(e) => {
                                const selected = cases.find((c: any) => c.id === e.target.value);
                                setCaseId(e.target.value);
                                setSelectedCase(selected); // store the full object
                            }}
                            className="form-select mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="">Select a case</option>
                            {cases.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {`${c.id} - ${c.property?.emirate} - ${c.property?.community}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="party-id"
                        >
                            Party
                        </label>
                        <select
                            id="party-id"
                            value={partyId}
                            onChange={(e) => setPartyId(e.target.value)}
                            className="form-select mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="">Select a case</option>
                            {parties.map((p: any) => (
                                <option key={p.id} value={p.id}>
                                    {`${p.members[0]?.name} (${p.role})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="currency"
                        >
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="form-select mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option>AED</option>
                            <option>USD</option>
                            <option>EUR</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="due-date"
                        >
                            Due Date
                        </label>
                        <div className="relative mt-1">
                            <input
                                id="due-date"
                                name="due-date"
                                placeholder="mm/dd/yyyy"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm pr-10"
                            />
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="material-icons-outlined text-gray-400">
                                          calendar_today
                                        </span>

                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Invoice Items
                    </h2>
                    <div className="space-y-2">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-10 gap-x-4 gap-y-4 items-end">
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor={`item-kind-${idx}`}
                                        >
                                            Service
                                        </label>
                                        <input
                                            id={`item-kind-${idx}`}
                                            value={item.kind}
                                            onChange={(e) =>
                                                updateItem(idx, "kind", e.target.value)
                                            }
                                            className="form-select mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor={`item-amount-${idx}`}
                                        >
                                            Amount
                                        </label>
                                        <input
                                            id={`item-amount-${idx}`}
                                            type="number"
                                            placeholder="0.00"
                                            value={item.amount}
                                            onChange={(e) =>
                                                updateItem(idx, "amount", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor={`item-quantity-${idx}`}
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            id={`item-quantity-${idx}`}
                                            type="number"
                                            placeholder="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(idx, "quantity", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor={`item-description-${idx}`}
                                        >
                                            Description
                                        </label>
                                        <input
                                            id={`item-description-${idx}`}
                                            type="text"
                                            placeholder="Describe item..."
                                            value={item.description}
                                            onChange={(e) =>
                                                updateItem(idx, "description", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            htmlFor={`item-subtotal-${idx}`}
                                        >
                                            Sub Total
                                        </label>
                                        <input
                                            id={`item-subtotal-${idx}`}
                                            type="text"
                                            readOnly={true}
                                            placeholder="Sub Total item..."
                                            value={item.subtotal}
                                            onChange={(e) =>
                                                updateItem(idx, "subtotal", e.target.value)
                                            }
                                            className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                                        >
                                            <span className="material-icons-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        onClick={addItem}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded text-primary bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
                    >
                        <span className="material-icons-outlined mr-2 -ml-1">add</span>
                        Add Item
                    </button>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800"
                    >
                        Create Invoice
                    </button>
                </div>
            </div>
        </form>
    )
}