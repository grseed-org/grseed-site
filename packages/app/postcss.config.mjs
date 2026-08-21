// Tailwind v4 under Next.js runs through PostCSS (the old @tailwindcss/vite
// plugin is gone with Vite). styles.css does `@import 'tailwindcss'`.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
