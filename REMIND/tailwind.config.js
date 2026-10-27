/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090F',
        surface: '#141420',
        card: '#1C1B2B',
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
        },
        text: {
          main: '#F8F7FF',
          secondary: '#9896AC',
        },
        border: '#292638',
        success: '#34D399',
        error: '#FB7185',
      },
      borderRadius: {
        'premium': '20px',
      },
    },
  },
  plugins: [],
}
