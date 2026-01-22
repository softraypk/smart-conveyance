"use client";

import React from "react";

type Props = {
    pageNumber: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
                                       pageNumber,
                                       totalPages,
                                       onPageChange,
                                   }: Props) {
    if (totalPages <= 1) return null;

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                Math.abs(i - pageNumber) <= 1
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center gap-2 mt-4 justify-start">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
                disabled={pageNumber === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium
                           bg-white text-gray-700 hover:bg-gray-100
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Prev
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                    <span key={idx} className="px-2 text-gray-400">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(p as number)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium transition
                            ${
                            pageNumber === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next Button */}
            <button
                onClick={() =>
                    onPageChange(Math.min(totalPages, pageNumber + 1))
                }
                disabled={pageNumber === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium
                           bg-white text-gray-700 hover:bg-gray-100
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
        </div>
    );
}