export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        goldLight: "#FFD700",
        goldDark: "#B8962E",
        dark: "#0B0B0B",
        dark2: "#111111",
      },
      boxShadow: {
        goldGlow: "0 0 15px rgba(212, 175, 55, 0.6)",
      },
      backgroundImage: {
        goldShine: "linear-gradient(135deg, #FFD700, #D4AF37, #B8962E)",
      },
    },
  },
  plugins: [],
}
