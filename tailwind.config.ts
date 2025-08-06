import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',   // for App Router
    './pages/**/*.{js,ts,jsx,tsx}', // for Pages Router
    './app/components/**/*.{js,ts,jsx,tsx}', // if you have a components folder
    './components/**/*.{js,ts,jsx,tsx}', // if you have a components folder
    './public/**/*.{html,js}', // if you have static HTML files
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
