"use client";

import Sidebar from "@/components/Sidebar";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import Pagination from "@/components/Pagination";
import {format} from 'date-fns';
import ProfileBuyerSellerModel from "@/components/ProfileBuyerSellerModel";
import PageLoader from "@/components/PageLoader";

interface User {
    id: string;
    name: string;
    email: string;
    initialBranchCheck: string;
    isUAEResident: string;
    nonResident: any | null;
    managedOrgId: string
    role?: string;
    parties: any | null
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [managedOrgId, setManagedOrgId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, sePageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(1);
    const [openUserProfile, setOpenUserProfile] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        console.log(storedUser);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setManagedOrgId(JSON.parse(storedUser).managedOrgId)
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        if (user?.role !== "SC_ADMIN") return;
        const fetchUsers = async () => {
            try {
                const response = await api(`/admins`, {
                    method: "GET"
                }); // ✅ Your endpoint

                console.log(response);

                if (response.ok) {
                    setUsers(response.results || []);
                } else {
                    console.error("Error fetching users:", response.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user?.role]);

    useEffect(() => {
        if (user?.role !== "ORG_ADMIN" || !managedOrgId) {
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            try {
                setLoading(true);

                const query = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
                const response = await api(
                    `/orgs/${managedOrgId}/users?${query}`,
                    {method: "GET"}
                );

                if (response.ok) {
                    setUsers(response.results?.data?.data || []);
                    setTotalRecords(response.results?.data?.meta?.total || 0);
                } else {
                    console.error("Error fetching users:", response.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [managedOrgId, user?.role, pageNumber, pageSize]);

    const handleUserProfile = (userid: string) => {
        setOpenUserProfile(true)
        setUserId(userid);
    }

    if (loading || !users) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                <PageLoader/>
            </div>
        );
    }

    if (user?.role === "ORG_ADMIN") {
        return (
            <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                {/* Header */}
                <Sidebar/>
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                            <button
                                className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95">
                                <span className="material-icons-outlined text-lg">add</span>
                                <span className="font-medium text-sm">Create New User</span>
                            </button>
                        </div>
                        <div
                            className="bg-white dark:bg-subtle-dark/50 pt-6 px-6 pb-0 rounded-t-xl border-x border-t border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                            <span
                                className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="Search by name" type="text"/>
                                </div>
                                <div className="relative">
                            <span
                                className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">alternate_email</span>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        placeholder="Search by email" type="text"/>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none appearance-none">
                                        <option>All Roles</option>
                                        <option>Buyer</option>
                                        <option>Seller</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                        type="date"/>
                                </div>
                            </div>
                            <Pagination
                                pageNumber={pageNumber}
                                pageSize={pageSize}
                                totalRecords={totalRecords}
                                totalPages={Math.ceil(totalRecords / pageSize)}
                                onPageChange={(page) => setPageNumber(page)}
                            />
                        </div>
                        <div
                            className="bg-white dark:bg-subtle-dark/50 rounded-b-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined
                                        At
                                    </th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div onClick={() => handleUserProfile(user?.id)}
                                                     className="flex items-center gap-3 cursor-pointer">
                                                    <div
                                                        className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary font-bold text-xs">
                                                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{user?.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {user?.email}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user?.parties[0]?.party?.role === "SELLER"
                                                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                                    }`}
                                                >
                                                  {user?.parties[0]?.party?.role === "SELLER" ? "Seller" : "Buyer"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    {user.isUAEResident === 'FALSE' ? (
                                                        <>
                                                          <span className="text-sm font-medium text-amber-600">
                                                            Non-Resident
                                                          </span>
                                                            <span className="text-xs text-slate-400">
                                                                {user.nonResident?.address?.country || '-'}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                          Resident
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {user?.parties[0]?.joinedAt
                                                    ? format(new Date(user.parties[0].joinedAt), 'MMM dd, yyyy hh:mm a')
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3 text-slate-400">
                                                    <button type={"button"} onClick={() => handleUserProfile(user?.id)}
                                                            className="hover:text-primary transition-colors"
                                                            title="View Details">
                                                        <span
                                                            className="material-icons-outlined text-xl">visibility</span>
                                                    </button>

                                                    {/*<button className="hover:text-amber-500 transition-colors"*/}
                                                    {/*        title="Edit">*/}
                                                    {/*    <span className="material-icons-outlined text-xl">edit</span>*/}
                                                    {/*</button>*/}

                                                    {/*<button className="hover:text-red-500 transition-colors"*/}
                                                    {/*        title="Delete">*/}
                                                    {/*    <span*/}
                                                    {/*        className="material-icons-outlined text-xl">delete_outline</span>*/}
                                                    {/*</button>*/}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-6 text-center text-sm text-slate-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                        <ProfileBuyerSellerModel userId={userId} open={openUserProfile}
                                                 onClose={() => setOpenUserProfile(false)}/>
                    </div>
                </main>
            </div>
        )
    } else if (user?.role === "SC_ADMIN") {
        return (
            <div className="flex h-screen">
                <Sidebar/>

                <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                    <div className="flex flex-col gap-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                                Users
                            </h1>
                            <button
                                onClick={() => router.push("/users/new")}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create New User
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by property"
                                    className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                                />
                            </div>

                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by party name"
                                    className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                                />
                            </div>

                            <div>
                                <select
                                    className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4">
                                    <option>Status: All</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Pending</option>
                                </select>
                            </div>

                            <div>
                                <input
                                    type="date"
                                    className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div
                            className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-black/5 dark:border-white/5 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-black/10 dark:border-white/10">
                                    <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">User
                                        ID
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60"> Email
                                    </th>
                                    {/*<th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Status</th>*/}
                                    {/*<th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Created*/}
                                    {/*    At*/}
                                    {/*</th>*/}
                                    <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-500">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-6 text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((User) => (
                                        <tr
                                            key={User.id}
                                            className="border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-4 py-4 font-medium">{User.id}</td>
                                            <td className="px-4 py-4 text-black/60 dark:text-white/60">{User.name}</td>
                                            <td className="px-4 py-4 text-black/60 dark:text-white/60">{User.email}</td>
                                            {/*<td className="px-4 py-4">*/}
                                            {/*    <span*/}
                                            {/*        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status}`}>*/}
                                            {/*        {user.status}*/}
                                            {/*    </span>*/}
                                            {/*</td>*/}
                                            {/*<td className="px-4 py-4 text-black/60 dark:text-white/60">{user.createdAt}</td>*/}
                                            <td className="px-4 py-4">
                                                <a onClick={() => router.push(`users/${User.id}`)}
                                                   className="font-semibold text-primary hover:underline cursor-pointer">
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}