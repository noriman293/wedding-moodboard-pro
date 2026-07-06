/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Inter', 'Montserrat', 'sans-serif'],
      },
      colors: {
        'wedding-gold': '#D4AF37',
        'wedding-cream': '#F5F5F0',
        'wedding-dark': '#2D2D2D',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      boxShadow: {
        'elegant': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
