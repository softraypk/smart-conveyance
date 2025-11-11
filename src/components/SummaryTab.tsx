interface OffersTabProps {
    mortgage: any;
}

function SummaryTab({mortgage}: OffersTabProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bank Details */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Bank Details
                </h2>
                <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                    <div
                        className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                            fill="currentColor"
                            height="28px"
                            viewBox="0 0 256 256"
                            width="28px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M24,104H48v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16H208V104h24a8,8,0,0,0,4.19-14.81l-104-64a8,8,0,0,0-8.38,0l-104,64A8,8,0,0,0,24,104Zm40,0H96v64H64Zm80,0v64H112V104Zm48,64H160V104h32ZM128,41.39,203.74,88H52.26ZM248,208a8,8,0,0,1-8,8H16a8,8,0,0,1,0-16H240A8,8,0,0,1,248,208Z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Bank Name
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {mortgage?.bank?.name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Loan Information */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Loan Information
                </h2>
                <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                    <div
                        className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                            fill="currentColor"
                            height="28px"
                            viewBox="0 0 256 256"
                            width="28px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Loan Amount
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat("en-AE", {
                                style: "currency",
                                currency: "AED",
                            }).format(mortgage?.amount || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Terms
                </h2>
                <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                    <div
                        className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                            fill="currentColor"
                            height="28px"
                            viewBox="0 0 256 256"
                            width="28px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91h0a36,36,0,0,1-50.92,50.91ZM56,76A20,20,0,1,0,90.14,61.84h0A20,20,0,0,0,56,76ZM216,180a36,36,0,1,1-10.54-25.46h0A35.76,35.76,0,0,1,216,180Zm-16,0a20,20,0,1,0-5.86,14.14A19.87,19.87,0,0,0,200,180Z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Interest Rate
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {mortgage?.rate}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Status
                </h2>
                <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6 flex items-start gap-6">
                    <div
                        className="flex-shrink-0 size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                        <svg
                            fill="currentColor"
                            height="28px"
                            viewBox="0 0 256 256"
                            width="28px"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Application Status
                        </p>
                        <p
                            className={`text-lg font-semibold ${
                                mortgage?.status === "APPROVED"
                                    ? "status-approved"
                                    : mortgage?.status === "PENDING"
                                        ? "status-pending"
                                        : mortgage?.status === "DECLINED"
                                            ? "status-declined"
                                            : "status-default"
                            }`}
                        >
                            {mortgage?.status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SummaryTab;