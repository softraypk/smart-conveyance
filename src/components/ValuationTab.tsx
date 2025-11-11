import SummaryTab from "@/components/SummaryTab";

interface OffersTabProps {
    mortgage: any;
}

function ValuationTab({mortgage}: OffersTabProps) {
    return (
        <div className="bg-white dark:bg-background-dark/50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Valuation Details
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
                Coming soon — valuation reports and appraisal details.
            </p>
        </div>
    );
}

export default ValuationTab;