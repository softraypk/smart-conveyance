interface OffersTabProps {
    mortgage: any;
}

function OffersTab({mortgage}: OffersTabProps) {
    return (
        <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Offers
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
                Offer documents and lender responses will appear here.
            </p>
        </div>
    );
}

export default OffersTab;