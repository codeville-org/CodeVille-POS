/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        sinhala: ["var(--font-sinhala)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"]
      }
    }
  },
  plugins: []
};
