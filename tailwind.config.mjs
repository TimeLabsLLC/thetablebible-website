/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Warm light backgrounds (CSS-var driven for dark mode)
        cream: {
          50: 'var(--cream-50)',
          100: 'var(--cream-100)',   // primary bg
          200: 'var(--cream-200)',   // secondary bg / cards
          300: 'var(--cream-300)',   // borders, dividers
          400: 'var(--cream-400)',   // muted elements
        },
        // Charcoal text
        charcoal: {
          DEFAULT: 'var(--charcoal)',
          light: 'var(--charcoal-light)',   // secondary text
          muted: 'var(--charcoal-muted)',   // muted/caption text
        },
        // Gold accent (retained from original)
        gold: {
          DEFAULT: 'var(--gold)',
          light: 'var(--gold-light)',
          dark: 'var(--gold-dark)',
          50: 'var(--gold-50)',
        },
        // Deep blue accent (primary accent)
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
          50: 'var(--accent-50)',
        },
        // Scripture highlight
        scripture: {
          bg: 'var(--scripture-bg)',
          border: 'var(--scripture-border)',
        },
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        content: '1080px',
        narrow: '760px',
        reading: '680px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        nav: '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
