import Sidebar from "@/components/Sidebar";

function Page() {
    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">Log Case Exception</h1>
                        <p className="text-text-sub text-sm mt-1">Submit a formal issue for Case #12345. This will pause
                            the
                            workflow until resolved.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 text-sm font-medium text-text-sub bg-white border border-border-gray rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-hover transition-colors shadow-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            Save Draft
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-card border border-border-gray overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div
                            className="w-full lg:w-1/3 bg-gray-50 border-b lg:border-b-0 lg:border-r border-border-gray p-6 lg:p-8">
                            <h3 className="text-sm font-bold text-text-sub uppercase tracking-wider mb-6">Case
                                Details</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-semibold text-text-sub mb-1">Property
                                        Address</label>
                                    <div className="flex items-center gap-2 text-text-main font-medium">
                                        <span
                                            className="material-symbols-outlined text-gray-400 text-[20px]">home</span>
                                        124 Willow Creek Ave, Springfield
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-sub mb-1">Assigned
                                        Conveyancer</label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                            <img alt="User avatar" className="w-full h-full object-cover"
                                                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh2XxtgOhS_kz2KaTg8MB9jx6hcePmu_xFoLd-LNxuTG6zLrkz0J3e58oasODY9sVYowcZZpvAN_KfYrVpiyCJXuiMaMayzkInXRU_q5j7olGgbaizxtmBnAWFR0L1h0mlhtt68oFefMd09yV2jPEAPs1sqUQ4p-aD-ib9NDkpGwbhQTL6MYBc5trj7V7Vaqk1zOi127f8DaffPyd_eb-nSpv41nmFS2pbe5_9vRAtRJz1w4DNTZiIDklK3CAQL_AwytqQe9h7vzHK"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-main">Sarah Jenkins</p>
                                            <p className="text-xs text-text-sub">Senior Conveyancer</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-border-gray">
                                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                                        <div className="flex items-start gap-3">
                                        <span
                                            className="material-symbols-outlined text-brand-blue text-[20px] mt-0.5">info</span>
                                            <div>
                                                <h4 className="text-sm font-semibold text-brand-blue mb-1">Workflow
                                                    Impact</h4>
                                                <p className="text-xs text-blue-800 leading-relaxed">
                                                    Logging this exception will immediately halt all automated tasks for
                                                    this case. The broker and client will be notified automatically.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 lg:p-8">
                            <form className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-1.5"
                                           htmlFor="exception-type">
                                        Exception Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="block w-full rounded-md border-border-gray text-sm text-text-main shadow-sm focus:border-brand-blue focus:ring-brand-blue py-2.5 pl-3 pr-10"
                                            id="exception-type">
                                            <option value="">Select a category...</option>
                                            <option value="legal">Legal Issue</option>
                                            <option value="doc_error">Documentation Error</option>
                                            <option value="client_delay">Client Delay</option>
                                            <option value="third_party">Third-Party Hold</option>
                                            <option value="financial">Financial Discrepancy</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-2">Priority
                                        Level</label>
                                    <div className="flex flex-wrap gap-3">
                                        <label className="cursor-pointer">
                                            <input className="peer sr-only" name="priority" type="radio" value="low"/>
                                            <div
                                                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white hover:bg-gray-50 peer-checked:border-green-500 peer-checked:text-green-700 peer-checked:bg-green-50 transition-all flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Low
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input className="peer sr-only" name="priority" type="radio"
                                                   value="medium"/>
                                            <div
                                                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white hover:bg-gray-50 peer-checked:border-orange-400 peer-checked:text-orange-700 peer-checked:bg-orange-50 transition-all flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                                Medium
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input className="peer sr-only" name="priority" type="radio"
                                                   value="critical"/>
                                            <div
                                                className="px-4 py-2 rounded-full border border-border-gray text-sm font-medium text-text-sub bg-white hover:bg-gray-50 peer-checked:border-red-500 peer-checked:text-red-700 peer-checked:bg-red-50 transition-all flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                Critical
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-1.5"
                                           htmlFor="description">
                                        Incident Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        className="block w-full rounded-md border-border-gray text-sm text-text-main shadow-sm focus:border-brand-blue focus:ring-brand-blue py-3 px-3 min-h-[140px]"
                                        id="description" placeholder="Describe the issue in detail..."></textarea>
                                    <p className="text-xs text-text-sub mt-1 text-right">0/500 characters</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main mb-1.5">Supporting
                                        Documents</label>
                                    <div
                                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-gray border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="space-y-1 text-center">
                                        <span
                                            className="material-symbols-outlined text-gray-400 text-[32px]">cloud_upload</span>
                                            <div className="flex text-sm text-text-sub justify-center">
                                                <label
                                                    className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand-blue hover:text-brand-blue-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue"
                                                    htmlFor="file-upload">
                                                    <span>Upload a file</span>
                                                    <input className="sr-only" id="file-upload" name="file-upload"
                                                           type="file"/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-text-sub">
                                                PDF, PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-border-gray flex items-center justify-end gap-3">
                                    <button
                                        className="px-5 py-2.5 text-sm font-medium text-text-main bg-white border border-border-gray rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                                        type="button">
                                        Cancel
                                    </button>
                                    <button
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue shadow-sm transition-colors flex items-center gap-2"
                                        type="submit">
                                        Create Exception
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Page;