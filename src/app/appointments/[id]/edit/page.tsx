"use client";

import Sidebar from "@/components/Sidebar";
import {useState} from "react";
import PageLoader from "@/components/PageLoader";
import {useParams} from "next/navigation";
import AppointmentForm from "@/components/AppointmentForm";

export default function EditAppointment() {
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const bookingId = params.id || null;

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-6 py-12">
                {loading && <PageLoader/>}
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-text-light-primary dark:text-dark-primary">
                            New Appointment
                        </h1>
                        <p className="mt-2 text-text-light-secondary dark:text-dark-secondary">
                            Fill in the details below to create a new appointment.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg shadow-sm p-8">
                        <AppointmentForm mode="edit" bookingId={bookingId} setLoading={setLoading}/>
                    </div>
                </div>
            </main>
        </div>
    );
}
