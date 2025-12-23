"use client";

import {useEffect, useState} from "react";
import OrgAdmin from "@/components/OrgAdmin";
import SCAdmin from "@/components/ScAdmin";
import MorgAdmin from "@/components/MorgAdmin";
import TrustAdmin from "@/components/TrustAdmin";
import PageLoader from "@/components/PageLoader";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import {api} from "@/lib/api";

interface User {
    name: string;
    email: string;
    role?: string;
}

export default function DashboardsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [exceptions, setExceptions] = useState<any[]>([]);

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
        const listCaseException = async () => {
            try {
                setLoading(true); // optional, only if you want parent loader

                const response = await api("/exceptions", {method: "GET"});

                if (response?.ok) {
                    setExceptions(response.results?.data?.exceptions || []);
                } else {
                    toast.error("Error: " + (response?.results?.message || "Unknown error"));
                }
            } catch (e: any) {
                toast.error("Error: " + (e?.message || e));
            } finally {
                setLoading(false); // hide parent loader
            }
        };

        listCaseException();
    }, []); // empty dependency to run only once on mount

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                <PageLoader/>
            </div>
        );
    }

    switch (user?.role) {
        case "ORG_ADMIN":
            return <OrgAdmin exceptions={exceptions}/>;
        case "MORTGAGE_BROKER":
        case "BROKER":
            return <MorgAdmin setLoading={setLoading}/>;
        case "TRUSTEE":
            return <TrustAdmin setLoading={setLoading}/>;
        default:
            return <SCAdmin setLoading={setLoading}/>;
    }
}