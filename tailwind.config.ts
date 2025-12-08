import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'onboarding-image': "url('/assets/images/onboarding-image.png')",
        'landing-image': "url('/assets/images/landing-urbanist-background.png')",
        'dashboard-card-bg': "url('/assets/images/dashboard-card-background.png')",
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
        'brand-marquee': 'brand-marquee 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
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
        'brand-marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      boxShadow: {
        strong: '0 10px 30px rgba(0,0,0,0.08)',
        soft: '0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
