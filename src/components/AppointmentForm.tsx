"use client";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

type Mode = "new" | "edit";

interface AppointmentFormProps {
    mode?: "new" | "edit";
    bookingId?: string | null;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AppointmentForm({mode = "new", bookingId = null, setLoading,}: AppointmentFormProps) {
    const [trusteeOfficeId, setTrusteeOfficeId] = useState("");
    const [caseId, setCaseId] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [repName, setRepName] = useState("");
    const [options, setOptions] = useState([]);
    const [cases, setCases] = useState([]);

    const router = useRouter();
    // ----------------------------
    // Load Cases + Trustee Offices
    // ----------------------------
    useEffect(() => {
        const loadData = async () => {
            try {
                const [caseRes, officesRes] = await Promise.all([
                    api(`/cases?statusFilter=${mode === "edit" ? "TRUSTEE_BOOKED" : "COMPLIANCE_READY"}`),
                    api("/trusteeOffice")
                ]);

                if (caseRes.ok) setCases(caseRes.results?.data?.cases || []);
                if (officesRes.ok) setOptions(officesRes.results?.data || []);

                // If UPDATE mode → Load appointment data
                if (mode === "edit") {
                    await loadAppointmentData();
                }

            } catch (error) {
                console.error("Load error:", error);
                toast.error("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // ----------------------------
    // Load appointment (only edit)
    // ----------------------------
    const loadAppointmentData = async () => {
        try {
            const res = await api(`/bookings/${bookingId}`, {method: "GET"});

            if (res.ok) {
                const a = res.results.data;
                setCaseId(a.caseId || "");
                setTrusteeOfficeId(a.slot?.officeId || "");
                setStart(a.slot?.start?.slice(0, 10) || "");
                setEnd(a.slot?.end?.slice(0, 10) || "");
                setRepName(a.repName || "");
            }
        } catch (e) {
            toast.error("Failed to load appointment");
        }
    };

    // ----------------------------
    // Submit Form
    // ----------------------------
    const handleSubmitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            caseId,
            trusteeOfficeId,
            start,
            end,
            repName,
        };

        try {
            let response;

            if (mode === "edit") {
                // Update
                response = await api(`/bookings/${bookingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
            } else {
                // New
                response = await api(`/bookings`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                toast.success(response.results.message);
                router.push("/appointments");
            } else {
                toast.error(response.results.message);
            }
        } catch (error) {
            toast.error("Error: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmitForm}>

            {/* CASE DROPDOWN */}
            <div>
                <label className="block text-sm text-text-light-secondary dark:text-dark-secondary mb-1">
                    Case ID
                </label>
                <div className="relative">
                    <span
                        className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-dark-secondary">
                        cases
                    </span>

                    <select
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md">
                        <option value="">Select Case</option>
                        {cases.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.id} — {item.property?.community}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TRUSTEE OFFICE */}
            <div>
                <label className="block text-sm text-text-light-secondary dark:text-dark-secondary mb-1">
                    Trustee Office
                </label>
                <div className="relative">
                    <span
                        className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-dark-secondary">
                        badge
                    </span>

                    <select
                        value={trusteeOfficeId}
                        onChange={(e) => setTrusteeOfficeId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md"
                    >
                        <option value="">Select Trustee Office</option>
                        {options.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* DATE FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start */}
                <div>
                    <label className="block text-sm text-text-light-secondary dark:text-dark-secondary mb-1">
                        Date From
                    </label>
                    <div className="relative">
                        <span
                            className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2">calendar_today</span>
                        <input
                            type="date"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md"
                        />
                    </div>
                </div>

                {/* End */}
                <div>
                    <label className="block text-sm text-text-light-secondary dark:text-dark-secondary mb-1">
                        Date To
                    </label>
                    <div className="relative">
                        <span
                            className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2">calendar_today</span>
                        <input
                            type="date"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* REP NAME */}
            <div>
                <label className="block text-sm text-text-light-secondary dark:text-dark-secondary mb-1">
                    Rep Name
                </label>
                <div className="relative">
                    <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2">person</span>
                    <input
                        type="text"
                        value={repName}
                        onChange={(e) => setRepName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md"
                        placeholder="Enter Representative Name"
                    />
                </div>
            </div>

            {/* BUTTON */}
            <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
                {mode === "edit" ? "Update Appointment" : "Save Appointment"}
            </button>
        </form>
    );
}