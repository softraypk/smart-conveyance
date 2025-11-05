import Sidebar from "@/components/Sidebar";

export default function PasswordPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-6 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Firm Activation</h2>
                        <p className="mt-2 text-foreground-light/70 dark:text-foreground-dark/70">Complete the following
                            details to activate your firm's account.</p>
                    </div>
                    <div className="space-y-8">
                        <div
                            className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold mb-6">Regulatory Details</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="rera-number">RERA
                                        Brokerage Number</label>
                                    <input
                                        className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-DEFAULT px-4 py-3 placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                        id="rera-number" placeholder="e.g., 12345" type="text"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="trade-license">Trade
                                        License Number</label>
                                    <input
                                        className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-DEFAULT px-4 py-3 placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                        id="trade-license" placeholder="e.g., CN-1234567" type="text"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" htmlFor="license-expiry">Trade
                                        License Expiry</label>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-DEFAULT px-4 py-3 pr-10 placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition appearance-none"
                                            id="license-expiry" type="date"/>
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <span
                                                className="material-symbols-outlined text-placeholder-light dark:text-placeholder-dark">calendar_today</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold mb-6">Upload Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div
                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg text-center">
                                    <span
                                        className="material-symbols-outlined text-5xl text-primary/50 mb-2">upload_file</span>
                                    <h4 className="font-semibold">Trade License</h4>
                                    <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">PDF,
                                        JPG, PNG up to 5MB</p>
                                    <button
                                        className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors">
                                        Choose File
                                    </button>
                                </div>
                                <div
                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg text-center">
                                    <span
                                        className="material-symbols-outlined text-5xl text-primary/50 mb-2">upload_file</span>
                                    <h4 className="font-semibold">RERA Certificate</h4>
                                    <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">PDF,
                                        JPG, PNG up to 5MB</p>
                                    <button
                                        className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors">
                                        Choose File
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-card-light dark:bg-card-dark p-8 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                            <h3 className="text-lg font-semibold mb-6">Branding</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                                <div
                                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg text-center h-full">
                                    <span
                                        className="material-symbols-outlined text-5xl text-primary/50 mb-2">image</span>
                                    <h4 className="font-semibold">Company Logo</h4>
                                    <p className="text-xs text-foreground-light/70 dark:text-foreground-dark/70 mt-1">PNG
                                        or JPG, square recommended</p>
                                    <button
                                        className="mt-4 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary font-semibold text-sm py-2 px-4 rounded-full transition-colors">
                                        Upload Logo
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" htmlFor="brand-color">Brand
                                            Color (Hex)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span
                                                    className="text-placeholder-light dark:text-placeholder-dark">#</span>
                                            </div>
                                            <input
                                                className="w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark rounded-DEFAULT pl-7 pr-4 py-3 placeholder:text-placeholder-light dark:placeholder:text-placeholder-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                                                id="brand-color" placeholder="0e6baa" type="text"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Color Preview</label>
                                        <div className="w-full h-12 rounded-DEFAULT bg-primary"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/50">
                                Save &amp; Continue
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}