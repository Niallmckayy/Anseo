/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "primary-dark": "#2D345D",
      "primary-light": "#F0F2FC",
      "primary-text-dark": "#3B447A",
      "form-button-grey": "#E0E0E0",
      "shaded-grey": "#ABB0B4",
      "user-sidebar-purple-light": "#E8EAF6",
      "user-sidebar-purple-dark": "#D1D6F5",
      white: "#FFFFFF",
      "bk-grey": "#F5F4FA",
      yellow: "#DEDA6D",
      black: "#000000",
      blue: "#1976d2",
      "faded-red": "#f89a93",
      "question-btn-primary": "#D1D6F5",
    },
    extend: {
      backgroundImage: {
        landingPageBackground: "url('/img/landing.png')",
        chatbotImage: "url('/img/chatbot-image.svg')",
      },
      fontFamily: {
        alegreya: ["Alegreya", "serif"],
        commissioner: ["Commissioner", "sans-serif"],
        fredoka: ["Fredoka One", "cursive"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
  ],
};
