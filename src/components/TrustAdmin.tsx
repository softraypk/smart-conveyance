"use client";

import {TrustHeader} from "@/components/TrustHeader";
import {JSX, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Helpers
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getStartDayOfMonth = (year: number, month: number) => (new Date(year, month, 1).getDay() + 6) % 7;
const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // Monday=0
    d.setDate(d.getDate() - day);
    return d;
};

interface AppointmentFormProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TrustAdmin({setLoading}: AppointmentFormProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedOffice, setSelectedOffice] = useState("Al Tamimi & Co");
    const [repName, setRepName] = useState("");
    const [viewMode, setViewMode] = useState<"month" | "week">("month"); // <-- view mode
    const [calendarBookings, setCalendarBookings] = useState<{ [key: string]: any[] }>({});
    const [loadingLocal, setLoadingLocal] = useState(true);


    // Load bookings
    useEffect(() => {
        const listBookings = async () => {
            try {
                setLoadingLocal(true);
                setLoading?.(true); // optional parent loader
                const response = await api(`/bookings`, {method: "GET"});

                if (response.ok) {
                    const fetchedBookings = response.results?.data?.bookings || [];
                    setBookings(fetchedBookings);

                    // Build calendar mapping by date
                    const calendarMap: { [key: string]: any[] } = {};

                    fetchedBookings.forEach((b: any) => {
                        const startDate = b.slot?.start?.substring(0, 10); // Extract YYYY-MM-DD

                        if (startDate) {
                            if (!calendarMap[startDate]) calendarMap[startDate] = [];
                            calendarMap[startDate].push(b);
                        }
                    });

                    setCalendarBookings(calendarMap);
                } else {
                    toast.error("Error: " + response.results?.message);
                }
            } catch (e) {
                toast.error("Error: " + e);
            } finally {
                setLoadingLocal(false);
                setLoading?.(false); // hide parent loader
            }
        };
        listBookings();
    }, []);

    const prevMonth = () => {
        if (currentMonth === 0) setCurrentYear(currentYear - 1), setCurrentMonth(11);
        else setCurrentMonth(currentMonth - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) setCurrentYear(currentYear + 1), setCurrentMonth(0);
        else setCurrentMonth(currentMonth + 1);
    };

    const BookingItem = ({booking}: { booking: any }) => {
        const router = useRouter();

        const buyer = booking.case?.parties?.find((p: any) => p.role === "BUYER")?.members?.[0];
        const seller = booking.case?.parties?.find((p: any) => p.role === "SELLER")?.members?.[0];

        const partyLabel = buyer
            ? `Buyer: ${buyer.name}`
            : seller
                ? `Seller: ${seller.name}`
                : "N/A";

        return (
            <div
                onClick={() => router.push(`/appointments/${booking.caseId}/show`)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
            >
                <div className="flex-1">
                    <p className="font-semibold">{partyLabel}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        Case ID: {booking.caseId}
                    </p>
                </div>
            </div>
        );
    };

    const CalendarCell = ({day, dateKey}: { day: number; dateKey: string }) => {
        const bookingsForDay = calendarBookings[dateKey] || [];

        return (
            <div
                className="relative min-h-[120px] bg-content-light dark:bg-content-dark
            border-r border-b border-border-light dark:border-border-dark p-2 text-sm"
            >
                <span className="font-bold">{day}</span>

                <div className="mt-1 space-y-1">
                    {bookingsForDay.map((b: any) => (
                        <BookingItem key={b.id} booking={b}/>
                    ))}
                </div>
            </div>
        );
    };


    // Generate cells for month or week view
    const renderCalendarCells = () => {
        if (viewMode === "month") {
            const daysInMonth = getDaysInMonth(currentYear, currentMonth);
            const startDay = getStartDayOfMonth(currentYear, currentMonth);
            const cells: JSX.Element[] = [];
            for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`}
                                                               className="bg-content-light dark:bg-content-dark min-h-[120px] border-r border-b border-border-light dark:border-border-dark"/>);
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                cells.push(
                    <CalendarCell key={day} day={day} dateKey={dateKey}/>
                );
            }
            return cells;
        } else {
            // week view: show 7 days starting from Monday of current week
            const today = new Date();
            const weekStart = getWeekStart(today);
            const cells: JSX.Element[] = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart);
                d.setDate(weekStart.getDate() + i);
                const day = d.getDate();
                const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                cells.push(
                    <CalendarCell key={day} day={day} dateKey={dateKey}/>
                );
            }
            return cells;
        }
    };

    return (

        <div className="flex h-screen w-full">
            <aside
                className="w-80 bg-content-light dark:bg-content-dark border-r border-border-light dark:border-border-dark flex flex-col">
                {/*<div className="flex items-center gap-3 px-6 py-5 border-b border-border-light dark:border-border-dark">*/}
                {/*    <div className="w-8 h-8 text-primary">*/}
                {/*        <svg*/}
                {/*            fill="none"*/}
                {/*            viewBox="0 0 48 48"*/}
                {/*            xmlns="http://www.w3.org/2000/svg"*/}
                {/*        >*/}
                {/*            <path*/}
                {/*                clipRule="evenodd"*/}
                {/*                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"*/}
                {/*                fill="currentColor"*/}
                {/*                fillRule="evenodd"*/}
                {/*            ></path>*/}
                {/*        </svg>*/}
                {/*    </div>*/}
                {/*    <h1 className="text-xl font-bold">Smart Conveyancing</h1>*/}
                {/*</div>*/}

                <div className="p-4">
                    <h2 className="text-lg font-bold px-2 pb-3">Compliance Ready Cases</h2>
                    <div className="space-y-2">
                        {bookings.map(b => <BookingItem key={b.id} booking={b}/>)}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <TrustHeader/>
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold">Trustee Office Booking Calendar</h2>
                            <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Book slots for ready
                                cases by dragging them onto the calendar.</p>
                        </div>

                        <div
                            className="flex items-center gap-2 p-1 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                            <label
                                className="cursor-pointer px-3 py-1.5 rounded has-[:checked]:bg-content-light dark:has-[:checked]:bg-content-dark has-[:checked]:shadow-sm">
                                <input className="sr-only" type="radio" name="view" value="week"
                                       checked={viewMode === "week"} onChange={() => setViewMode("week")}/>
                                <span className="text-sm font-medium">Week</span>
                            </label>
                            <label
                                className="cursor-pointer px-3 py-1.5 rounded has-[:checked]:bg-content-light dark:has-[:checked]:bg-content-dark has-[:checked]:shadow-sm">
                                <input className="sr-only" type="radio" name="view" value="month"
                                       checked={viewMode === "month"} onChange={() => setViewMode("month")}/>
                                <span className="text-sm font-medium">Month</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-content-light dark:bg-content-dark p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <select
                                    className="flex items-center gap-2 px-5 py-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium"
                                    value={selectedOffice} onChange={e => setSelectedOffice(e.target.value)}>
                                    <option>Al Tamimi & Co</option>
                                    <option>Office 2</option>
                                    <option>Office 3</option>
                                </select>

                                <input
                                    className="flex items-center gap-2 px-5 py-3 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium"
                                    value={repName} onChange={e => setRepName(e.target.value)}/>
                            </div>

                            {viewMode === "month" && (
                                <div className="flex items-center gap-2">
                                    <button onClick={prevMonth}
                                            className="flex items-center justify-center size-9 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <p className="text-lg font-bold">{MONTH_NAMES[currentMonth]} {currentYear}</p>
                                    <button onClick={nextMonth}
                                            className="flex items-center justify-center size-9 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark">
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div
                            className={`grid ${viewMode === "month" ? "grid-cols-7" : "grid-cols-7"} gap-px border-l border-t border-border-light dark:border-border-dark bg-border-light dark:bg-border-dark`}>
                            {viewMode === "month" && ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                                <div key={d}
                                     className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">{d}</div>
                            ))}
                            {renderCalendarCells()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}