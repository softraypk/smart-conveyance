export function transformMonthlyCases(monthlyCases?: any[]) {
    if (!Array.isArray(monthlyCases)) return [];

    const STATUSES = [
        'DRAFT',
        'OFFERING',
        'AGREED',
        'COMPLIANCE_READY',
        'TRUSTEE_BOOKED',
        'FINALIZED',
        'CLOSED',
    ];

    return STATUSES.map((status) => {
        const row: Record<string, number | string> = {
            status: status.replace(/_/g, ' '),
        };

        for (const monthObj of monthlyCases) {
            row[monthObj.month] = Number(monthObj[status] ?? 0);
        }

        return row;
    });
}
