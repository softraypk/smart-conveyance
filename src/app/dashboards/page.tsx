"use client";

import {useEffect, useState} from "react";
import OrgAdmin from "@/components/OrgAdmin";
import SCAdmin from "@/components/ScAdmin";
import MorgAdmin from "@/components/MorgAdmin";
import TrustAdmin from "@/components/TrustAdmin";
import PageLoader from "@/components/PageLoader";

interface User {
    name: string;
    email: string;
    role?: string;
}

export default function DashboardsPage() {
    const [user, setUser] = useState<User | null>(null);

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

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                <PageLoader/>
            </div>
        );
    }

    if (user?.role === "ORG_ADMIN") {
        return <OrgAdmin/>;
    } else if (user?.role === "MORTGAGE_BROKER" || user?.role === "BROKER") {
        return <MorgAdmin/>;
    } else if (user?.role === "TRUSTEE") {
        return <TrustAdmin/>;
    } else {
        return <SCAdmin/>;
    }
}