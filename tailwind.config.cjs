/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/pages/**/*.{js,ts,jsx,tsx}', // include if you have pages
    ],
    theme: {
        extend: {},
    },
    corePlugins: {
        preflight: true, // enables base styles
    },
    plugins: [],
    safelist: [
        'text-green-600',
        'text-red-600',
        'bg-green-600',
        'bg-red-600',
        'bg-blue-500',
        'text-white'
    ],
};