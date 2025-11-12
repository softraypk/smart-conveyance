const API = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function api(path: string, init: RequestInit = {}, customToken?: string) {
    const token = customToken || (typeof window !== "undefined" ? localStorage.getItem("authToken") : null);
    const isFormData = init.body instanceof FormData;

    const headers = {
        accept: "*/*",
        ...(isFormData ? {} : {"Content-Type": "application/json"}),
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
        ...init.headers,
    };

    const url = `${API.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

    console.log("URL: ", url);

    try {
        const response = await fetch(url, {cache: "no-store", ...init, headers});

        let results = null;
        try {
            results = await response.json();
        } catch {
            results = null;
        }

        if (!response.ok) {
            let message = "An unknown error occurred.";

            if (response.status === 400 && results?.errors) {
                message = Object.values(results.errors).flat().join(", ");
            } else if (response.status === 404) {
                message = "Resource not found.";
            } else if (response.status === 401) {
                message = "Unauthorized. Please log in again.";
            } else if (response.status === 403) {
                message = "Access denied.";
            } else if (response.status === 500) {
                message = results?.message || "Server error — please try again later.";
            } else if (results?.message) {
                message = results.message;
            }

            return {
                ok: false,
                status: response.status,
                error: message,
                results,
            };
        }

        return {
            ok: true,
            status: response.status,
            results,
        };
    } catch (err) {
        console.error("API request failed:", err);
        return {
            ok: false,
            status: 0,
            error: "Network error. Please check your connection or try again.",
            results: null,
        };
    }
}