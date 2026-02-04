"use client";

import React from "react";

type Props = {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
                                       pageNumber,
                                       pageSize,
                                       totalRecords,
                                       totalPages,
                                       onPageChange,
                                   }: Props) {
    if (totalPages <= 1) return null;

    const start = (pageNumber - 1) * pageSize + 1;
    const end = Math.min(pageNumber * pageSize, totalRecords);

    return (
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            {/* Results Count */}
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                    {start}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                    {end}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900 dark:text-white">
                    {totalRecords}
                </span>{" "}
                results
            </p>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(pageNumber - 1)}
                    disabled={pageNumber === 1}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700
                               rounded-lg text-sm font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Previous
                </button>

                <button
                    onClick={() => onPageChange(pageNumber + 1)}
                    disabled={pageNumber === totalPages}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700
                               rounded-lg text-sm font-medium
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
}