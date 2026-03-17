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
                    DEFAULT: '#3B2F2F', // Dark Wood
                },
                accent: {
                    DEFAULT: '#E5C76B', // Brass
                    light: '#F4E4AD',
                },
                brand: {
                    cream: '#FDF5E6',
                    'text-dark': '#222222',
                    'text-light': '#666666',
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
