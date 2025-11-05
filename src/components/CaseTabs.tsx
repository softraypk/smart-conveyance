"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";

export default function CaseTabs() {
    const pathname = usePathname();

    // Split and filter path segments
    const pathSegments = pathname.split("/").filter(Boolean);
    // Examples:
    // /cases/new                     → ["cases", "new"]
    // /cases/new/abc123/property     → ["cases", "new", "abc123", "property"]
    // /cases/abc123/property         → ["cases", "abc123", "property"]

    let caseId: string | null = null;
    let isNewFlow = false;

    // Detect whether path is "new" flow or "existing case"
    if (pathSegments[1] === "new") {
        isNewFlow = true;
        caseId = pathSegments.length >= 3 ? pathSegments[2] : null;
    } else if (pathSegments.length >= 2) {
        caseId = pathSegments[1]; // e.g., /cases/2a28134b-a6b9...
    }

    const lastSegment = pathSegments[pathSegments.length - 1];

    const tabs = [
        {name: "General Information", key: "new"},
        {name: "Property Details", key: "property"},
        {name: "Buyer Details", key: "buyer"},
        {name: "Seller Details", key: "seller"},
        {name: "Documents", key: "documents"},
        {name: "Overview", key: "overview"},
    ];

    return (
        <div className="pb-3 border-b border-[#cfdfe7] dark:border-gray-700 flex gap-8 px-4">
            {tabs.map((tab) => {
                // ✅ Build correct hrefs for both modes
                let href = "/cases/new";

                if (isNewFlow) {
                    // Create new case flow → /cases/new/<caseId>/<tab>
                    if (tab.key !== "new" && caseId) {
                        href = `/cases/new/${caseId}/${tab.key}`;
                    }
                } else {
                    // Existing case flow → /cases/<caseId>/<tab>
                    if (tab.key === "new") {
                        href = `/cases/${caseId}`;
                    } else if (caseId) {
                        href = `/cases/${caseId}/${tab.key}`;
                    }
                }

                // Determine active tab
                const isActive =
                    (tab.key === "new" &&
                        (pathname === "/cases/new" ||
                            pathname === `/cases/${caseId}`)) ||
                    lastSegment === tab.key;

                // Disable if no caseId yet (except General Info)
                const isDisabled = !caseId && tab.key !== "new";

                const tabClasses = `pb-[13px] pt-4 font-bold text-sm border-b-[3px] transition-colors ${
                    isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-[#4c809a] dark:text-gray-400 hover:text-primary hover:border-primary/60"
                } ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`;

                return (
                    <Link
                        key={tab.key}
                        href={isDisabled ? "#" : href}
                        className={tabClasses}
                        aria-disabled={isDisabled}
                    >
                        {tab.name}
                    </Link>
                );
            })}
        </div>
    );
}