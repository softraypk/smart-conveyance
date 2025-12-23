import Sidebar from "@/components/Sidebar";

interface AppointmentFormProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MorgAdmin({setLoading}: AppointmentFormProps) {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col">
            <Sidebar/>
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-black dark:text-white">Mortgage Applications</h1>
                        <button
                            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90">
                            <span className="material-symbols-outlined text-base"> add </span>
                            <span className="truncate">Create Mortgage Application</span>
                        </button>
                    </div>
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Status</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Bank</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Date</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                    </div>
                    <div
                        className="overflow-x-auto rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50">
                        <table className="min-w-full divide-y divide-primary/20">
                            <thead className="bg-background-light dark:bg-background-dark/80">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Case ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Buyer Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Property
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Bank Partner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60"
                                    scope="col">Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/20 bg-white dark:bg-background-dark/50">
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-001</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Sarah
                                    Al Maktoum
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Apartment
                                    101, Burj Residences
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Emirates
                                    NBD
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">Approved</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-002</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Omar
                                    Al Falahi
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Villa
                                    32, The Meadows
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Abu
                                    Dhabi Commercial Bank
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-003</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Fatima
                                    Al Mansoori
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Townhouse
                                    15, Arabian Ranches
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Mashreq
                                    Bank
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300">In Review</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-004</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Ahmed
                                    Al Rashidi
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Apartment
                                    205, Dubai Marina
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Standard
                                    Chartered
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">Approved</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-005</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Layla
                                    Al Shamsi
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Villa
                                    7, Emirates Hills
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">First
                                    Abu Dhabi Bank
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300">Pending</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-006</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Khalid
                                    Al Mazrouei
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Townhouse
                                    22, Jumeirah Village Circle
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Emirates
                                    Islamic Bank
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-300">In Review</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">Case-2024-007</td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Aisha
                                    Al Kaabi
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Apartment
                                    302, Downtown Dubai
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">Abu
                                    Dhabi Islamic Bank
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span
                                        className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/50 px-3 py-1 text-sm font-medium text-green-800 dark:text-green-300">Approved</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                    <a className="text-primary hover:underline" href="#">View</a>
                                    <span className="mx-2 text-black/30 dark:text-white/30">|</span>
                                    <a className="text-primary hover:underline" href="#">Update</a>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}