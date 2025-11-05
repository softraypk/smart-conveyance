"use client";

import Sidebar from "@/components/Sidebar";
import {FormEvent, useEffect, useRef, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

interface Organization {
    id: number;
    legalName: string;
    name: string;
    email: string;
    phone: string;
    subdomain: string;
    country: string;
    emirate: boolean;
    website: string;
    reraNumber: string;
    tradeLicenseNo: string;
    tradeLicenseExpiry: string;
    brandColor: string;
    dataResidency: string;
    languageDefault: string;
    tier: string;
    status: string;
    internalNotes: string;
    reraCertificate: {
        mimeType: string;
        filename: string;
        url: string;
    };
    tradeLicense: {
        mimeType: string;
        filename: string;
        url: string;
    };
    logo: {
        mimeType: string;
        filename: string;
        url: string;
    };
}

export default function EditPage() {
    const [reraNumber, setReraNumber] = useState("");
    const [tradeLicenseNo, setTradeLicenseNo] = useState("");
    const [tradeLicenseExpiry, setTradeLicenseExpiry] = useState("");
    const [brandColor, setBrandColor] = useState("");

    const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
    const [reraCertificateFile, setReraCertificateFile] = useState<File | null>(null);
    const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);

    const tradeLicenseRef = useRef<HTMLInputElement | null>(null);
    const reraRef = useRef<HTMLInputElement | null>(null);
    const logoRef = useRef<HTMLInputElement | null>(null);

    const [user, setUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const id = useParams();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        const fetchOrganization = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api(`/orgs/${user?.managedOrgId}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = response.results?.data;
                    setOrganization(data);
                    setReraNumber(data?.reraNumber || "");
                    setTradeLicenseNo(data?.tradeLicenseNo || "");
                    setTradeLicenseExpiry(data?.tradeLicenseExpiry || "");
                    setBrandColor(data?.brandColor || "");
                } else {
                    console.error("Failed to fetch organization:", response);
                    setError("Failed to load organization");
                }
            } catch (e) {
                console.error(e);
                setError("Something went wrong while loading organization data");
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrganization();
    }, [user]);

    // --- handle form submission ---
    const handlerUpdateForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("reraNumber", reraNumber);
            formData.append("tradeLicenseNo", tradeLicenseNo);
            formData.append("tradeLicenseExpiry", tradeLicenseExpiry);
            formData.append("brandColor", brandColor);

            if (tradeLicenseFile) formData.append("tradeLicense", tradeLicenseFile);
            if (reraCertificateFile) formData.append("reraCertificate", reraCertificateFile);
            if (companyLogoFile) formData.append("companyLogo", companyLogoFile);

            const response = await api(`/orgs/${user?.managedOrgId}/profile`, {
                method: "PATCH",
                body: formData,
            });

            if (response.ok) {
                toast.success("Record Updated Successfully!");
                router.push("/");
            } else {
                toast.error("Error: " + (response.results?.message || "Upload failed"));
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Network Error");
        } finally {
            setLoading(false);
        }
    };

    // --- file selection handlers ---
    const handleFileChange =
        (setter: (file: File | null) => void) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) setter(file);
            };

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-6 py-12">
                <form onSubmit={handlerUpdateForm} className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Firm Activation</h2>
                        <p className="mt-2 text-foreground-light/70 dark:text-foreground-dark/70">
                            Complete the following details to activate your firm&#39;s account.
                        </p>
                    </div>

                    {/* --- Regulatory Details --- */}
                    <div
                        className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark mb-8">
                        <h3 className="text-lg font-semibold mb-6">Regulatory Details</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="rera-number">
                                    RERA Brokerage Number
                                </label>
                                <input
                                    value={reraNumber}
                                    onChange={(e) => setReraNumber(e.target.value)}
                                    className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                    id="rera-number"
                                    placeholder="e.g., 12345"
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="trade-license">
                                    Trade License Number
                                </label>
                                <input
                                    value={tradeLicenseNo}
                                    onChange={(e) => setTradeLicenseNo(e.target.value)}
                                    className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                    id="trade-license"
                                    placeholder="e.g., CN-1234567"
                                    type="text"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" htmlFor="license-expiry">
                                    Trade License Expiry
                                </label>
                                <input
                                    value={tradeLicenseExpiry}
                                    onChange={(e) => setTradeLicenseExpiry(e.target.value)}
                                    className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                    id="license-expiry"
                                    type="date"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Upload Documents --- */}
                    <div
                        className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark mb-8">
                        <h3 className="text-lg font-semibold mb-6">Upload Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Trade License */}
                            <div
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-5xl text-primary/50 mb-2">
                  upload_file
                </span>
                                <h4 className="font-semibold">Trade License</h4>
                                <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">
                                    PDF, JPG, PNG up to 5MB
                                </p>
                                <button
                                    type="button"
                                    onClick={() => tradeLicenseRef.current?.click()}
                                    className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors"
                                >
                                    Choose File
                                </button>
                                <input
                                    type="file"
                                    ref={tradeLicenseRef}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileChange(setTradeLicenseFile)}
                                />
                                {tradeLicenseFile && (
                                    <p className="mt-2 text-sm text-gray-500">{tradeLicenseFile.name}</p>
                                )}
                            </div>

                            {/* RERA Certificate */}
                            <div
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-5xl text-primary/50 mb-2">
                  upload_file
                </span>
                                <h4 className="font-semibold">RERA Certificate</h4>
                                <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">
                                    PDF, JPG, PNG up to 5MB
                                </p>
                                <button
                                    type="button"
                                    onClick={() => reraRef.current?.click()}
                                    className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors"
                                >
                                    Choose File
                                </button>
                                <input
                                    type="file"
                                    ref={reraRef}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileChange(setReraCertificateFile)}
                                />
                                {reraCertificateFile && (
                                    <p className="mt-2 text-sm text-gray-500">{reraCertificateFile.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Branding --- */}
                    <div
                        className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark mb-8">
                        <h3 className="text-lg font-semibold mb-6">Branding</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                            {/* Company Logo */}
                            <div
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center border-border-light dark:border-border-dark">
                <span className="material-symbols-outlined text-5xl text-primary/50 mb-2">
                  image
                </span>
                                <h4 className="font-semibold">Company Logo</h4>
                                <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">
                                    PNG or JPG, square recommended
                                </p>
                                <button
                                    type="button"
                                    onClick={() => logoRef.current?.click()}
                                    className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors"
                                >
                                    Upload Logo
                                </button>
                                <input
                                    type="file"
                                    ref={logoRef}
                                    accept=".jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={handleFileChange(setCompanyLogoFile)}
                                />
                                {companyLogoFile && (
                                    <p className="mt-2 text-sm text-gray-500">{companyLogoFile.name}</p>
                                )}
                            </div>

                            {/* Brand Color */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="brand-color">
                                        Brand Color (Hex)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-placeholder-light dark:text-placeholder-dark">#</span>
                                        </div>
                                        <input
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-md pl-7 pr-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                            id="brand-color"
                                            placeholder="0e6baa"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Color Preview</label>
                                    <div
                                        className="w-full h-12 rounded-md"
                                        style={{backgroundColor: brandColor ? `#${brandColor}` : "#0e6baa"}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Save Button --- */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50 disabled:opacity-50"
                        >
                            {loading ? "Uploading..." : "Save & Continue"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}