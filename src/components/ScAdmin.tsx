import Sidebar from "@/components/Sidebar";

interface AppointmentFormProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SCAdmin({setLoading}: AppointmentFormProps) {
    return (
        <div className="flex h-screen">
            <Sidebar/>
            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                            Admin Dashboard
                        </h1>

                        <div className="w-full sm:w-72">
                            <select
                                className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4">
                                <option value="">Select Organization</option>
                                <option value="org1">Organization One</option>
                                <option value="org2">Organization Two</option>
                                <option value="org3">Organization Three</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                Total Active Cases
                            </p>
                            <p className="text-3xl font-bold text-black/90 dark:text-white/90">1,234</p>
                        </div>

                        <div
                            className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                Exception Count
                            </p>
                            <p className="text-3xl font-bold text-black/90 dark:text-white/90">56</p>
                        </div>

                        <div
                            className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                SLA Violations
                            </p>
                            <p className="text-3xl font-bold text-red-500">12</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                search
              </span>
                        </div>

                        <input
                            type="search"
                            placeholder="Search cases across all organizations..."
                            className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}