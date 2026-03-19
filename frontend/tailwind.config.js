/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#C04B2A', // Terracotta
                    dark: '#A03D22',
                },
                secondary: {
                    DEFAULT: '#0f172a', // Slate-900
                },
                accent: {
                    DEFAULT: '#64748b', // Slate-500
                    light: '#94a3b8',   // Slate-400
                },
                brand: {
                    cream: '#f8fafc',      // Slate-50
                    'text-dark': '#0f172a', // Slate-900
                    'text-light': '#64748b', // Slate-500
                },
                // Admin Theme Colors (SaaS Light)
                'admin-primary': '#10b981', // Emerald
                'admin-secondary': '#1e293b', // Slate-800 for text/subtle icons
                'admin-accent': '#f59e0b', // Amber
                'admin-bg': '#f8fafc', // Slate-50 background
                'admin-card': '#ffffff',
                'admin-border': '#e2e8f0', // Slate-200
            },
            fontFamily: {
                'playfair': ['"Playfair Display"', 'serif'],
                'poppins': ['"Poppins"', 'sans-serif'],
                'outfit': ['"Outfit"', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 10px 40px rgba(0, 0, 0, 0.08)',
            }
        },
    },
    plugins: [],
}
