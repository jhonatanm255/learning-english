/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        // Definimos una sombra personalizada llamada "shadow-top"
        top: "0 4px 6px 8px rgb(0 0 0 / 0.1)", // Ajusta los valores a tu preferencia
      },
    },
  },
  darkMode: "class",  // Habilita el modo oscuro con clase 'dark'
  plugins: [],
};

