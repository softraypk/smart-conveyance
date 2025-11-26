import Sidebar from "@/components/Sidebar";
import {TrustHeader} from "@/components/TrustHeader";

export default function TrustAdmin() {
    return (
        <div className="flex h-screen w-full">
            <Sidebar/>
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
                                <input className="sr-only" name="view" type="radio" value="week"/>
                                <span className="text-sm font-medium">Week</span>
                            </label>
                            <label
                                className="cursor-pointer px-3 py-1.5 rounded has-[:checked]:bg-content-light dark:has-[:checked]:bg-content-dark has-[:checked]:shadow-sm">
                                <input className="sr-only" name="view" type="radio" value="month"/>
                                <span className="text-sm font-medium">Month</span>
                            </label>
                        </div>
                    </div>
                    <div className="bg-content-light dark:bg-content-dark p-6 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium">
                                    Trustee Office
                                    <span className="material-symbols-outlined text-base">expand_more</span>
                                </button>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 rounded border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark hover:bg-primary/10 dark:hover:bg-primary/20 text-sm font-medium">
                                    Smart Convey Rep
                                    <span className="material-symbols-outlined text-base">expand_more</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex items-center justify-center size-9 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <p className="text-lg font-bold">July 2024</p>
                                <button
                                    className="flex items-center justify-center size-9 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                        <div
                            className="grid grid-cols-7 gap-px border-l border-t border-border-light dark:border-border-dark bg-border-light dark:bg-border-dark">
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">MON
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">TUE
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">WED
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">THU
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">FRI
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">SAT
                            </div>
                            <div
                                className="text-center py-3 bg-content-light dark:bg-content-dark text-sm font-bold text-text-muted-light dark:text-text-muted-dark">SUN
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">1
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">2
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">3
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">4
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm bg-primary/5 dark:bg-primary/10">
                                <span className="font-bold text-primary">5</span>
                                <div className="mt-1 space-y-1">
                                    <div
                                        className="group relative rounded-md bg-primary/10 dark:bg-primary/20 p-2 text-xs cursor-pointer">
                                        <p className="font-semibold">Al Tamimi &amp; Co</p>
                                        <p className="text-text-muted-light dark:text-text-muted-dark">9:00 - 10:00</p>
                                        <div
                                            className="absolute z-10 hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-background-dark dark:bg-background-light text-white dark:text-black text-xs rounded shadow-lg">
                                            Office: Al Tamimi &amp; Co<br/>
                                            Slot: 9:00 - 10:00<br/>
                                            Rep: Ali Ahmed
                                        </div>
                                    </div>
                                    <div
                                        className="group relative rounded-md bg-green-500/10 dark:bg-green-400/20 p-2 text-xs cursor-pointer">
                                        <p className="font-semibold text-green-800 dark:text-green-300">Case #123456</p>
                                        <p className="text-green-600 dark:text-green-400">Sarah Khan</p>
                                        <div
                                            className="absolute z-10 hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-background-dark dark:bg-background-light text-white dark:text-black text-xs rounded shadow-lg">
                                            Buyer: Sarah Khan<br/>
                                            Case ID: 123456<br/>
                                            Rep: Ali Ahmed
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">6
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark">7
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">8
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">9
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">10
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">11
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">12
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">13
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark">14
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">15
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">16
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">17
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">18
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">19
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">20
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark">21
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">22
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">23
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">24
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">25
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">26
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">27
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark">28
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">29
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">30
                            </div>
                            <div
                                className="relative min-h-[120px] bg-content-light dark:bg-content-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm">31
                            </div>
                            <div
                                className="relative min-h-[120px] bg-background-light dark:bg-background-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark"></div>
                            <div
                                className="relative min-h-[120px] bg-background-light dark:bg-background-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark"></div>
                            <div
                                className="relative min-h-[120px] bg-background-light dark:bg-background-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark"></div>
                            <div
                                className="relative min-h-[120px] bg-background-light dark:bg-background-dark border-r border-b border-border-light dark:border-border-dark p-2 text-sm text-text-muted-light dark:text-text-muted-dark"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
