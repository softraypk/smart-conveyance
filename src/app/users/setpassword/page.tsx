"use client";

import {Suspense} from "react";
import SetPasswordPage from "@/app/users/setpassword/SetPasswordPage";

export const dynamic = "force-dynamic"; // <— FIXES BUILD ERROR

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SetPasswordPage/>
        </Suspense>
    );
}
