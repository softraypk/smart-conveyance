"use client";

import {TrustHeader} from "@/components/TrustHeader";
import {JSX, useEffect, useRef, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

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

interface Props {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    bookings: any[];
}

export default function TrusteeCalender({setLoading, bookings}: Props): JSX.Element {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedOffice, setSelectedOffice] = useState("Al Tamimi & Co");
    const [repName, setRepName] = useState("");
    const [viewMode, setViewMode] = useState<"month" | "week">("month"); // <-- view mode
    const [calendarBookings, setCalendarBookings] = useState<{ [key: string]: any[] }>({});

    // Load bookings
    useEffect(() => {
        if (!bookings || bookings.length === 0) return;

        const calendarMap: { [key: string]: any[] } = {};

        bookings.forEach((b: any) => {
            const startDate = b.slot?.start?.substring(0, 10); // YYYY-MM-DD
            if (!startDate) return;

            if (!calendarMap[startDate]) {
                calendarMap[startDate] = [];
            }

            calendarMap[startDate].push(b);
        });
        setCalendarBookings(calendarMap);
    }, [bookings]);

    const prevMonth = () => {
        if (currentMonth === 0) setCurrentYear(currentYear - 1), setCurrentMonth(11);
        else setCurrentMonth(currentMonth - 1);
    };
    const nextMonth = () => {
        if (currentMonth === 11) setCurrentYear(currentYear + 1), setCurrentMonth(0);
        else setCurrentMonth(currentMonth + 1);
    };

    const DraggableBooking = ({booking}: { booking: any }) => {
        const ref = useRef<HTMLDivElement>(null);

        const [{isDragging}, drag] = useDrag(() => ({
            type: "booking",
            item: {
                ...booking,
                trusteeOfficeId: booking.officeId,
                repName: booking.repName,
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }));

        drag(ref);

        const buyer = booking.case?.parties?.find((p: any) => p.role === "BUYER")?.members?.[0];
        const seller = booking.case?.parties?.find((p: any) => p.role === "SELLER")?.members?.[0];
        const partyLabel = buyer
            ? `Buyer: ${buyer.name}`
            : seller
                ? `Seller: ${seller.name}`
                : "N/A";
        return (
            <div
                ref={ref}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-grab active:cursor-grabbing ${
                    isDragging ? "opacity-50" : "hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}>
                {/*<div*/}
                {/*    className="flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-12 text-primary">*/}
                {/*    <span className="material-symbols-outlined">home</span>*/}
                {/*</div>*/}

                <div className="flex-1">
                    <p className="font-semibold">{partyLabel}</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                        Case ID: {booking.caseId}
                    </p>
                </div>
            </div>
        );
    };


    const CalendarCell = ({day, dateKey, trusteeOfficeId, repName}: {
        day: number;
        dateKey: string;
        trusteeOfficeId: string;
        repName: string;
    }) => {
        // local ref for the DOM node
        const containerRef = useRef<HTMLDivElement | null>(null);

        // useDrop returns [collectedProps, dropConnector]
        const [{isOver}, dropConnector] = useDrop(() => ({
            accept: "booking",
            drop: async (item: any) => {
                // Update local state
                setCalendarBookings((prev) => {
                    const newState: Record<string, any[]> = {};

                    // Remove from previous date
                    for (const date in prev) {
                        newState[date] = prev[date].filter((b) => b.id !== item.id);
                    }

                    // Add to new date
                    newState[dateKey] = [...(newState[dateKey] || []), item];
                    return newState;
                });

                // Payload for API
                const payload = {
                    caseId: item.caseId,
                    trusteeOfficeId: item.trusteeOfficeId,
                    start: `${dateKey}T10:00:00Z`,
                    end: `${dateKey}T11:00:00Z`,
                    repName: item.repName,
                };

                try {
                    const response = await api(`/bookings/${item.id}`, {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) toast.error("Failed to update booking date");
                } catch (err) {
                    toast.error("Error saving booking: " + err);
                }
            },
            collect: (monitor) => ({isOver: monitor.isOver()}),
        }));

        // Attach the drop connector to the DOM node when it mounts / changes.
        useEffect(() => {
            // call dropConnector with the DOM node (or null to detach)
            dropConnector(containerRef.current);
            // detach on unmount (cleanup)
            return () => {
                dropConnector(null);
            };
        }, [dropConnector]);

        const bookingsForDay = calendarBookings[dateKey] || [];

        return (
            <div
                ref={containerRef}
                className={`relative min-h-[120px] bg-content-light dark:bg-content-dark 
                border-r border-b border-border-light dark:border-border-dark p-2 text-sm 
                ${isOver ? "bg-primary/20 dark:bg-primary/30" : ""}`}
            >
                <span className="font-bold">{day}</span>

                <div className="mt-1 space-y-1">
                    {bookingsForDay.map((b: any) => (
                        <DraggableBooking key={b.id} booking={b}/>
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
                    <CalendarCell
                        key={day}
                        day={day}
                        dateKey={dateKey}
                        trusteeOfficeId={selectedOffice} // or UUID if you have
                        repName={repName}
                    />
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
                    <CalendarCell
                        key={day}
                        day={day}
                        dateKey={dateKey}
                        trusteeOfficeId={selectedOffice} // or UUID if you have
                        repName={repName}
                    />
                );
            }
            return cells;
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex h-screen w-full">
                <aside
                    className="w-80 bg-content-light dark:bg-content-dark border-r border-border-light dark:border-border-dark flex flex-col">
                    <div className="p-4">
                        <h2 className="text-lg font-bold px-2 pb-3">Compliance Ready Cases</h2>
                        <div className="space-y-2">
                            {bookings.map(b => <DraggableBooking key={b.id} booking={b}/>)}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col">
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
        </DndProvider>
    );
}