"use client";

import {JSX, useEffect, useRef, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getStartDayOfMonth = (year: number, month: number) => (new Date(year, month, 1).getDay() + 6) % 7;
const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - day);
    return d;
};

interface Props {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    bookings: any[];
    complianceReadyCases: any[] | undefined;
    trusteeOffice: any[];
}

export default function TrusteeCalendar({
                                            setLoading,
                                            bookings,
                                            complianceReadyCases,
                                            trusteeOffice
                                        }: Props): JSX.Element {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedOffice, setSelectedOffice] = useState("");
    const [repName, setRepName] = useState("");
    const [viewMode, setViewMode] = useState<"month" | "week">("month");
    const [calendarBookings, setCalendarBookings] = useState<Record<string, any[]>>({});
    const [unassignedCases, setUnassignedCases] = useState<any[]>([]);

    /* ================= Load Bookings and Cases ================= */
    useEffect(() => {
        setLoading(true);

        const bookingsMap: Record<string, any[]> = {};
        const unassigned: any[] = [];

        bookings?.forEach(b => {
            const startDate = b.slot?.start?.substring(0, 10);
            if (!startDate) return;
            bookingsMap[startDate] = [...(bookingsMap[startDate] || []), b];
        });

        (Array.isArray(complianceReadyCases) ? complianceReadyCases : []).forEach(c => {
            unassigned.push(c);
        });

        setCalendarBookings(bookingsMap);
        setUnassignedCases(unassigned);
        setLoading(false);
    }, [bookings, complianceReadyCases, setLoading]);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentYear(y => y - 1);
            setCurrentMonth(11);
        } else {
            setCurrentMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentYear(y => y + 1);
            setCurrentMonth(0);
        } else {
            setCurrentMonth(m => m + 1);
        }
    };

    /* ================= Draggable Booking ================= */
    const DraggableBooking = ({booking}: { booking: any }) => {
        const ref = useRef<HTMLDivElement>(null);
        const [{isDragging}, drag] = useDrag(() => ({
            type: "case",
            item: {
                bookingId: booking.id && booking.slot ? booking.id : null,
                caseId: booking.caseId || booking.id,
                repName: booking.repName || ""
            },
            collect: monitor => ({isDragging: monitor.isDragging()})
        }));
        drag(ref);

        const buyer = booking.parties?.find((p: any) => p.role === "BUYER")?.members?.[0];
        const seller = booking.parties?.find((p: any) => p.role === "SELLER")?.members?.[0];
        const partyLabel = booking.repName || (buyer ? `Buyer: ${buyer.name}` : seller ? `Seller: ${seller.name}` : "N/A");

        // ✅ Display BookingID if this is a booked calendar item, else CaseID
        const displayID = booking.slot ? booking.id : booking.caseId || booking.id;

        return (
            <div
                ref={ref}
                className={`flex items-center gap-2 p-2 rounded cursor-grab ${isDragging ? "opacity-50" : "hover:bg-primary/10 dark:hover:bg-primary/20"}`}
            >
                <div>
                    <p className="font-semibold">{partyLabel}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        {booking.slot ? `Booking ID: ${displayID}` : `Case ID: ${displayID}`}
                    </p>
                </div>
            </div>
        );
    };

    /* ================= Calendar Cell ================= */
    const CalendarCell = ({day, dateKey}: { day: number; dateKey: string }) => {
        const containerRef = useRef<HTMLDivElement | null>(null);

        const [{isOver}, drop] = useDrop(() => ({
            accept: "case",
            drop: async (item: any) => {
                if (!selectedOffice) return toast.error("Select a trustee office first");
                if (!repName) return toast.error("Enter representative name");

                const payload = {
                    id: item.bookingId || Math.random().toString(),
                    caseId: item.caseId,
                    trusteeOfficeId: selectedOffice,
                    start: `${dateKey}T10:00:00Z`,
                    end: `${dateKey}T11:00:00Z`,
                    repName
                };

                try {
                    let response;
                    if (item.bookingId) {
                        response = await api(`/bookings/${item.bookingId}`, {
                            method: "PUT",
                            body: JSON.stringify(payload)
                        });
                    } else {
                        response = await api("/bookings", {method: "POST", body: JSON.stringify(payload)});
                    }

                    if (!response.ok) return toast.error("Failed to save booking");

                    setCalendarBookings(prev => {
                        const newState: Record<string, any[]> = {};
                        for (const date in prev) {
                            newState[date] = (prev[date] || []).filter(b => (b.id || b.caseId) !== payload.id);
                        }
                        newState[dateKey] = [...(newState[dateKey] || []), payload];
                        return newState;
                    });

                    // Remove from unassigned if coming from sidebar
                    setUnassignedCases(prev => prev.filter(c => c.id !== item.caseId));

                    toast.success(item.bookingId ? "Booking updated" : "Booking created");
                } catch (err) {
                    toast.error("Error saving booking: " + err);
                }
            },
            collect: monitor => ({isOver: monitor.isOver()})
        }));

        useEffect(() => {
            if (containerRef.current) {
                drop(containerRef.current); // attach the drop to the div
            }
        }, [drop]);

        const bookingsForDay = calendarBookings[dateKey] || [];

        return (
            <div
                ref={containerRef}
                className={`relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm ${isOver ? "bg-primary/20 dark:bg-primary/30" : ""}`}
            >
                <span className="font-bold">{day}</span>
                <div className="mt-1 space-y-1">
                    {bookingsForDay.map(b => <DraggableBooking key={b.id || b.caseId} booking={b}/>)}
                </div>
            </div>
        );
    };

    /* ================= Render Calendar ================= */
    const renderCalendarCells = () => {
        if (viewMode === "month") {
            const daysInMonth = getDaysInMonth(currentYear, currentMonth);
            const startDay = getStartDayOfMonth(currentYear, currentMonth);
            const cells: JSX.Element[] = [];

            for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`}
                                                               className="bg-content-light dark:bg-content-dark min-h-[120px] border-r border-b border-border-light dark:border-border-dark"/>);
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                cells.push(<CalendarCell key={day} day={day} dateKey={dateKey}/>);
            }
            return cells;
        }

        const weekStart = getWeekStart(new Date());
        return Array.from({length: 7}).map((_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            return <CalendarCell key={i} day={d.getDate()} dateKey={dateKey}/>;
        });
    };

    /* ================= JSX ================= */
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen w-full">
                {/* Sidebar for unassigned cases */}
                <aside
                    className="w-80 bg-content-light dark:bg-content-dark border-r border-border-light dark:border-border-dark flex flex-col">
                    <div className="p-4">
                        <h2 className="text-lg font-bold px-2 pb-3">Compliance Ready Cases</h2>
                        <div className="space-y-2">
                            {unassignedCases.map(c => <DraggableBooking key={c.id} booking={c}/>)}
                        </div>
                    </div>
                </aside>

                {/* Main Calendar */}
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold">Trustee Office Booking Calendar</h2>
                                <p className="text-text-muted-light dark:text-text-muted-dark mt-1">Drag cases onto the
                                    calendar to book them.</p>
                            </div>

                            <div
                                className="inline-flex items-center rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-1">
                                <button type="button" onClick={() => setViewMode("week")}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === "week" ? "bg-primary text-white shadow-sm" : "text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 dark:hover:bg-primary/20"}`}>Week
                                </button>
                                <button type="button" onClick={() => setViewMode("month")}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${viewMode === "month" ? "bg-primary text-white shadow-sm" : "text-text-muted-light dark:text-text-muted-dark hover:bg-primary/10 dark:hover:bg-primary/20"}`}>Month
                                </button>
                            </div>
                        </div>

                        <div className="bg-content-light dark:bg-content-dark p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <select className="px-5 py-3 border rounded" value={selectedOffice}
                                            onChange={e => setSelectedOffice(e.target.value)}>
                                        <option>---</option>
                                        {trusteeOffice.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    <input className="px-5 py-3 border rounded" placeholder="Rep Name" value={repName}
                                           onChange={e => setRepName(e.target.value)}/>
                                </div>

                                {viewMode === "month" && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={prevMonth} className="px-2">◀</button>
                                        <p className="font-bold">{MONTH_NAMES[currentMonth]} {currentYear}</p>
                                        <button onClick={nextMonth} className="px-2">▶</button>
                                    </div>
                                )}
                            </div>

                            <div
                                className="grid grid-cols-7 gap-px border-t border-l border-border-light dark:border-border-dark bg-border-light dark:bg-border-dark">
                                {viewMode === "month" && ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(d => (
                                    <div key={d}
                                         className="text-center py-2 font-bold text-sm bg-content-light dark:bg-content-dark">{d}</div>
                                ))}
                                {renderCalendarCells()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DndProvider>
    );
}