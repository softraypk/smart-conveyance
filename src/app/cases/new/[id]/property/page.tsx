"use client";

import Sidebar from "@/components/Sidebar";
import CasePropertyForm from "@/components/CasePropertyForm";
import CaseTabs from "@/components/CaseTabs";
import {useParams, useRouter} from "next/navigation";

export default function PropertyPage() {
    const id = useParams();
    const router = useRouter();


    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col w-full">
                {/* Sidebar */}
                <Sidebar/>

                {/* Main */}
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
                        <div className="flex flex-col max-w-[960px] flex-1">
                            {/* Title */}
                            <div className="flex flex-wrap justify-between gap-3 p-4">
                                <div className="flex flex-col gap-3 min-w-72">
                                    <p className="text-4xl font-black text-[#0d171b] dark:text-white leading-tight tracking-tight">
                                        Create New Case
                                    </p>
                                    <p className="text-base text-[#4c809a] dark:text-gray-400">
                                        Please fill in the general details for the new case.
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">

                                <CaseTabs/>

                                {/* Form */}
                                <CasePropertyForm/>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
