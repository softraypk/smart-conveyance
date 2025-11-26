"use client";

import {FormEvent, use} from "react"; // 👈 new React 19 hook
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {motion, AnimatePresence} from "framer-motion";
import toast from "react-hot-toast";
import {TrustHeader} from "@/components/TrustHeader";

interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
    phone: string;
    orgId: string;
    branchId: string;
    managedOrgId?: string;
    managedOrg: {
        legalName: string;
    },
    trusteeOffice: {
        name: string;
    }
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

export default function UserProfile({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [user, setUser] = useState<User | "">("");
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [existingPassword, setExistingPassword] = useState("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api(`/users/${id}`);
                //toast.error("User not found" + res.status);

                if (res.status === 200) {
                    setUser(res.results.data);
                } else {
                    console.log("Failed to fetch user:", res);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    useEffect(() => {
        const fetchOrganization = async () => {
            if (!user || !user.managedOrgId) return;
            setLoading(true);
            setError("");

            try {
                const response = await api(`/orgs/${user?.managedOrgId}`, {
                    method: "GET",
                });

                if (response.ok) {
                    // Adjust depending on your API response shape
                    setOrganization(response.results?.data);
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

        if (showOrgModal) {
            fetchOrganization();
        } else {
            setOrganization(null); // clear old data when closed
        }
    }, [showOrgModal, user]);


    const handlerChangePasswordForm = async (e: FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                password,
                existingPassword
            }
            const response = await api("/auth/password", {
                method: "PATCH",
                body: JSON.stringify(payload)
            });

            //toast.error("User not found" + response.status);

            if (response.ok) {
                toast.success("Password changed successfully!");
                setExistingPassword("");
                setPassword("");
                setConfirmPassword("");
            } else {
                toast.error("Failed: " + response.results?.message);
            }
        } catch (error) {
            console.error("Change password error:", error);
            toast.error(error + "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };


    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500 dark:text-gray-300">
                Loading user...
            </div>
        );
    }

    if (user.role === "TRUSTEE") {
        return (
            <div className="flex h-screen w-full">
                <Sidebar/>
                <main className="flex-1 flex flex-col">
                    <TrustHeader/>
                    <div className="flex-1 p-8">
                        <div className="max-w-4xl mx-auto">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-black dark:text-white">
                                    Profile &amp; Authentication
                                </h1>
                            </header>

                            {loading ? (
                                <p className="text-gray-500">Loading...</p>
                            ) : (
                                <div className="space-y-12">
                                    {/* Profile Section */}
                                    <section className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Profile</h2>
                                        <div className="flex flex-col sm:flex-row items-start gap-8">
                                            <div
                                                className="flex-shrink-0 w-32 h-32 rounded-full bg-cover bg-center"
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCok-Zcax6FUn6HGi2ZvY9BQXljMRfv8nPR1LU_-594guRRJ_8BSBX_6J2P2BrZHLjrjXAjaw8_EMDSm6chgpFYpHklGlryFCxYawIVC0ErgBuRye8rU_RXjKH0lCGwPExre7VS-3M5II3s8AStNStEoAjTZm3UxybIj8NpD_ZWnUHp2wTmX5VjduG6xea_h-7xSX_5UreZJL2C9YYetVpgeA_UP_5y2EIApUgVzpV-raSZvS83ztSecp-7K-1SEfCHBNfuSS6e33IZ")',
                                                }}
                                            ></div>

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <p className="text-2xl font-bold text-black dark:text-white">
                                                        {user?.name ?? "-"}
                                                    </p>
                                                    <p className="text-black/60 dark:text-white/60">{user?.email ?? "-"}</p>
                                                    <p className="text-black/60 dark:text-white/60">{user?.phone ?? "-"}</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                                                    <div className="flex flex-col">
                                                <span className="text-sm font-medium text-black/60 dark:text-white/60">
                                                    Role
                                                </span>
                                                        <span className="text-base text-black dark:text-white">
                                                    {user?.role ?? "-"}
                                                </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                <span className="text-sm font-medium text-black/60 dark:text-white/60">
                                                    Organization
                                                </span>
                                                        <span
                                                            className="text-base text-black dark:text-white"> {user?.trusteeOffice?.name || "-"} </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Security Section */}
                                    <section className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                        <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Security</h2>
                                        <div className="space-y-6">
                                            <div
                                                className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                                                <div>
                                                    <h3 className="font-semibold text-black dark:text-white">
                                                        Linked Accounts
                                                    </h3>
                                                    <p className="text-sm text-black/60 dark:text-white/60">
                                                        Connect your UAE PASS for seamless login.
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-primary">UAE PASS ID</span>
                                                    <span className="material-symbols-outlined text-green-500">
                                                check_circle
                                            </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-black dark:text-white">
                                                        Two-Factor Authentication (2FA)
                                                    </h3>
                                                    <p className="text-sm text-black/60 dark:text-white/60">
                                                        Add an extra layer of security to your account.
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input className="sr-only peer" type="checkbox" value=""/>
                                                    <div
                                                        className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer dark:bg-white/20 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        )
    }


    return (
        <div
            className={user?.role === "ORG_ADMIN" || user?.role === "MORTGAGE_BROKER" || user?.role === "BROKER" ? "flex flex-col min-h-screen" : "flex h-screen"}>
            <Sidebar/>
            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-black dark:text-white">
                            Profile &amp; Authentication
                        </h1>
                    </header>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : (
                        <div className="space-y-12">
                            {/* Profile Section */}
                            <section className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Profile</h2>
                                <div className="flex flex-col sm:flex-row items-start gap-8">
                                    <div
                                        className="flex-shrink-0 w-32 h-32 rounded-full bg-cover bg-center"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCok-Zcax6FUn6HGi2ZvY9BQXljMRfv8nPR1LU_-594guRRJ_8BSBX_6J2P2BrZHLjrjXAjaw8_EMDSm6chgpFYpHklGlryFCxYawIVC0ErgBuRye8rU_RXjKH0lCGwPExre7VS-3M5II3s8AStNStEoAjTZm3UxybIj8NpD_ZWnUHp2wTmX5VjduG6xea_h-7xSX_5UreZJL2C9YYetVpgeA_UP_5y2EIApUgVzpV-raSZvS83ztSecp-7K-1SEfCHBNfuSS6e33IZ")',
                                        }}
                                    ></div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <p className="text-2xl font-bold text-black dark:text-white">
                                                {user?.name ?? "-"}
                                            </p>
                                            <p className="text-black/60 dark:text-white/60">{user?.email ?? "-"}</p>
                                            <p className="text-black/60 dark:text-white/60">{user?.phone ?? "-"}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-black/60 dark:text-white/60">
                                                    Role
                                                </span>
                                                <span className="text-base text-black dark:text-white">
                                                    {user?.role ?? "-"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-black/60 dark:text-white/60">
                                                    Organization
                                                </span>
                                                <span
                                                    className="text-base text-black dark:text-white"> {user?.managedOrg?.legalName || "-"} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Security Section */}
                            <section className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Security</h2>
                                <div className="space-y-6">
                                    <div
                                        className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                                        <div>
                                            <h3 className="font-semibold text-black dark:text-white">
                                                Linked Accounts
                                            </h3>
                                            <p className="text-sm text-black/60 dark:text-white/60">
                                                Connect your UAE PASS for seamless login.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-primary">UAE PASS ID</span>
                                            <span className="material-symbols-outlined text-green-500">
                                                check_circle
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-black dark:text-white">
                                                Two-Factor Authentication (2FA)
                                            </h3>
                                            <p className="text-sm text-black/60 dark:text-white/60">
                                                Add an extra layer of security to your account.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input className="sr-only peer" type="checkbox" value=""/>
                                            <div
                                                className="w-11 h-6 bg-black/20 peer-focus:outline-none rounded-full peer dark:bg-white/20 peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>
                            {(user?.role === "ORG_ADMIN") ? (
                                <footer className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
                                    <button onClick={() => setShowModal(true)}
                                            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-bold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors">
                                        Change Password
                                    </button>
                                    <button
                                        onClick={() => setShowOrgModal(true)} //onClick={() => router.push(`/users/${user.id}/edit`)}
                                        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white font-bold hover:opacity-90 transition-opacity">
                                        Organizational Profile
                                    </button>
                                </footer>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            {/* ✅ Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    {/* Modal content */}
                    <div
                        className="w-full max-w-md mx-auto bg-white dark:bg-background-dark/50 rounded-xl shadow-2xl p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-xl font-bold">×
                        </button>
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                Change Password
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                Enter the new password and confirm password.
                            </p>
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handlerChangePasswordForm}>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    htmlFor="name"
                                >
                                    Old Password *
                                </label>
                                <input
                                    value={existingPassword}
                                    onChange={(e) => setExistingPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    id="name"
                                    placeholder="Old password"
                                    required
                                    type="password"/>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    htmlFor="name"
                                >
                                    Password *
                                </label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    id="name"
                                    placeholder="password"
                                    required
                                    type="password"/>
                            </div>

                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    htmlFor="email"
                                >
                                    Confirm Password *
                                </label>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                                    id="email"
                                    placeholder="confirm password"
                                    required
                                    type="password"/>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-colors duration-300"
                            >
                                Send Invite
                            </button>
                        </form>
                    </div>
                </div>
            )}


            <AnimatePresence>
                {showOrgModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <motion.div
                            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background-light dark:bg-background-dark rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
                            initial={{scale: 0.95, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            exit={{scale: 0.95, opacity: 0}}
                            transition={{type: "spring", stiffness: 200, damping: 25}}
                        >
                            {/* Header */}
                            <header
                                className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Organization Profile
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Compliance documents and organization profile.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowOrgModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </header>

                            {/* Main Content */}
                            <div className="flex flex-col lg:flex-row p-6 gap-6">
                                {/* Left Column */}
                                <div className="flex-1 space-y-6">
                                    {/* Organization Summary */}
                                    <div
                                        className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Organization Summary
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                            {[
                                                ["Organization Name", organization?.legalName],
                                                ["Registration Number", organization?.reraNumber],
                                                ["Contact Email", organization?.email],
                                                ["Contact Phone", organization?.phone],
                                                ["Address", organization?.country],
                                            ].map(([label, value]) => (
                                                <div
                                                    key={label}
                                                    className={`flex justify-between py-2 border-b border-gray-200 dark:border-gray-800 ${
                                                        label === "Address" ? "md:col-span-2" : ""
                                                    }`}
                                                >
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KYC Documents */}
                                    <div
                                        className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            KYC Documents
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead>
                                                <tr>
                                                    {["Document Type", "Status", "Action"].map((h) => (
                                                        <th
                                                            key={h}
                                                            className={`px-4 py-3 text-xs font-medium uppercase tracking-wider ${
                                                                h === "Action" ? "text-right" : "text-left"
                                                            } text-gray-500 dark:text-gray-400`}
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {[
                                                    {
                                                        name: "Trade License",
                                                        status: "Approved",
                                                        color: "green",
                                                        url: organization?.tradeLicense?.url,
                                                    },
                                                    {
                                                        name: "Rera Certificate",
                                                        status: "Pending Review",
                                                        color: "yellow",
                                                        url: organization?.reraCertificate?.url,
                                                    },
                                                    {
                                                        name: "Bank Statement",
                                                        status: "Approved",
                                                        color: "green",
                                                        url: organization?.logo?.url,
                                                    },
                                                ].map(({name, status, color, url}) => (
                                                    <tr key={name}>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            {name}
                                                        </td>

                                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`}
        >
          {status}
        </span>
                                                        </td>

                                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <a
                                                                href={url}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:text-primary/80 flex items-center justify-end gap-1"
                                                            >
                                                                <span>Download</span>
                                                                <span
                                                                    className="material-symbols-outlined text-base">download</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="w-full lg:w-96 space-y-6 flex-shrink-0">
                                    {/* Status */}
                                    <div
                                        className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Organization Status
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Update the organization&#39;s status based on compliance review.
                                        </p>
                                        <div className="space-y-3">
                                            {["Pending Review", "Active", "Suspended"].map((label) => (
                                                <label
                                                    key={label}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer 
      ${label === "Active"
                                                        ? "bg-primary/10 border-primary dark:bg-primary/20"
                                                        : "border-gray-200 dark:border-gray-800"
                                                    }`}
                                                >
                                                <span
                                                    className={`text-sm font-medium 
                                                    ${label === organization?.status
                                                        ? "text-primary"
                                                        : "text-gray-800 dark:text-gray-200"
                                                    }`}
                                                >
                                                  {label}
                                                </span>
                                                </label>
                                            ))}

                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {/*<div*/}
                                    {/*    className="bg-white dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-800">*/}
                                    {/*    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">*/}
                                    {/*        Internal Notes*/}
                                    {/*    </h3>*/}
                                    {/*    <textarea*/}
                                    {/*        className="form-textarea w-full rounded border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 focus:border-primary focus:ring-primary/50 placeholder-gray-400 dark:placeholder-gray-500 min-h-[120px] text-sm"*/}
                                    {/*        placeholder="Add internal notes for the team..."*/}
                                    {/*    ></textarea>*/}
                                    {/*</div>*/}

                                    <button onClick={() => router.push(`/users/${user?.id}/edit`)}
                                            className="w-full flex items-center justify-center gap-2 rounded bg-primary py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                                    >
                                        Update Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}