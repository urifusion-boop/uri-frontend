import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'onboarding-image': "url('/assets/images/onboarding-image.png')",
        'landing-image':
          "url('/assets/images/landing-urbanist-background.png')",
        'dashboard-card-bg':
          "url('/assets/images/dashboard-card-background.png')",
        'subscription-card-bg': "url('/assets/images/billing-card-bg.png')",
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans", sans-serif'],
        urbanist: ['"Urbanist", sans-serif'],
        raleway: ['"Raleway", sans-serif'],
        segoue: ['"Segoe UI", sans-serif'],
      },
      animation: {
        slide: 'slide 10s linear infinite',
        bounce: 'bounce 1s ease-in-out infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '30%': { transform: 'translateX(0)' },
          '35%': { transform: 'translateX(-100%)' },
          '65%': { transform: 'translateX(-100%)' },
          '70%': { transform: 'translateX(-200%)' },
          '95%': { transform: 'translateX(-200%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(15px)' },
        },
      },
      colors: {
        primary: '#CD1B78',
      },
    },
  },
  plugins: [],
};
export default config;
