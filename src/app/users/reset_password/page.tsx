"use client";

import {Suspense} from "react";
import ReSetPasswordPage from "./ReSetPasswordPage";

export const dynamic = "force-dynamic"; // <— FIXES BUILD ERROR

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReSetPasswordPage/>
        </Suspense>
    );
}
