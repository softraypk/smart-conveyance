/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // adjust if needed
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#2563eb", // blue-600 (you can use your brand color)
                    light: "#3b82f6",   // optional
                    dark: "#1e40af",    // optional
                },
            },
        },
    },
    plugins: [],
}
