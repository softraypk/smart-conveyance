"use client"

import {FormEvent, SyntheticEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import {useRouter} from "next/navigation";

interface Admin {
    id: number;
    name: string;
}

export default function OrgForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [legalName, setLegalName] = useState("");
    const [reraNumber, setReraNumber] = useState("");
    const [tradeLicenseNo, setTradeLicenseNo] = useState("");
    const [tradeLicenseExpiry, setTradeLicenseExpiry] = useState("");
    const [subdomain, setSubdomain] = useState("");
    const [scManagerId, setScManagerId] = useState("");
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();


    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await api("/admins", {method: "GET"}); // ✅ call your helper
                if (response.ok) {
                    setAdmins(response.results || []);
                } else {
                    console.error("Error fetching admins:", response.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins(); // ✅ invoke inside useEffect
    }, []);


    const handlerSaveForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            // Always await the api() call

            const payload = {
                name,
                legalName,
                reraNumber,
                tradeLicenseNo,
                tradeLicenseExpiry,
                email,
                phone,
                subdomain,
                scManagerId
            };

            const result = await api("/orgs", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            console.log("Login result:", result);

            // If the response includes the token and message
            if (result.ok) {
                setMessage("Login successful!");
                router.push("/organizations");
            } else {
                setError(result.error || `Error ${result.status}`);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handlerSaveForm}>
            {/* Legal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                        Legal / Trading Name
                    </label>
                    <input
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                        type="text"
                        placeholder="Enter legal or trading name"
                        className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                        RERA #
                    </label>
                    <input
                        value={reraNumber}
                        onChange={(e) => setReraNumber(e.target.value)}
                        type="text"
                        placeholder="Enter RERA number"
                        className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                        Trade License #
                    </label>
                    <input
                        value={tradeLicenseNo}
                        onChange={(e) => setTradeLicenseNo(e.target.value)}
                        type="text"
                        placeholder="Enter trade license number"
                        className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                        Expiry Date
                    </label>
                    <input
                        value={tradeLicenseExpiry ? tradeLicenseExpiry.split("T")[0] : ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value) {
                                // Only convert if user selected a valid date
                                setTradeLicenseExpiry(new Date(value).toISOString());
                            } else {
                                // Handle cleared input safely
                                setTradeLicenseExpiry("");
                            }
                        }}
                        type="date"
                        className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                    />
                </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-black/10 dark:border-white/10 pt-6">
                <h2 className="text-lg font-semibold text-black/90 dark:text-white/90 mb-4">
                    Primary Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter primary contact name"
                            className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter primary contact email"
                            className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                            Phone
                        </label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="tel"
                            placeholder="Enter primary contact phone"
                            className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                        />
                    </div>
                </div>
            </div>

            {/* System Config */}
            <div className="border-t border-black/10 dark:border-white/10 pt-6">
                <h2 className="text-lg font-semibold text-black/90 dark:text-white/90 mb-4">
                    System Configuration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">*/}
                    {/*        Plan / Tier*/}
                    {/*    </label>*/}
                    {/*    <select*/}
                    {/*        className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"*/}
                    {/*    >*/}
                    {/*        <option>Select Plan</option>*/}
                    {/*        <option>Basic</option>*/}
                    {/*        <option>Professional</option>*/}
                    {/*        <option>Enterprise</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <div>
                        <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                            Subdomain
                        </label>
                        <div className="flex">
                            <input
                                value={subdomain}
                                onChange={(e) => setSubdomain(e.target.value)}
                                type="text"
                                placeholder="acme"
                                className="form-input w-full rounded-l-lg border border-black/10 dark:border-white/10 border-r-0 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                            />
                            <span
                                className="inline-flex items-center px-4 rounded-r-lg border border-l-0 border-black/10 dark:border-white/10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                                                .smartconvey.ae
                                            </span>
                        </div>
                    </div>

                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">*/}
                    {/*        Data Residency*/}
                    {/*    </label>*/}
                    {/*    <select*/}
                    {/*        className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"*/}
                    {/*    >*/}
                    {/*        <option>Select Region</option>*/}
                    {/*        <option>UAE</option>*/}
                    {/*        <option>KSA</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}

                    <div>
                        <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                            Assign SC Account Manager
                        </label>
                        <select
                            value={scManagerId}
                            onChange={(e) => setScManagerId(e.target.value)}
                            className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"
                        >
                            <option value="">Select Manager</option>
                            {admins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    {/*<div className="md:col-span-2">*/}
                    {/*    <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">*/}
                    {/*        Status*/}
                    {/*    </label>*/}
                    {/*    <select*/}
                    {/*        className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/80 dark:text-white/80 focus:ring-primary focus:border-primary py-3 px-4"*/}
                    {/*    >*/}
                    {/*        <option>PENDING_REVIEW</option>*/}
                    {/*        <option>ACTIVE</option>*/}
                    {/*    </select>*/}
                    {/*</div>*/}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
                <button
                    type="submit"
                    className="bg-primary text-white font-semibold rounded-lg px-6 py-3 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition"
                >
                    Create Organization
                </button>
            </div>
        </form>
    )
}