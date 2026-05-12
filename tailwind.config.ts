import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nikah: {
          bg:     '#FAF5F5',
          pink:   '#E8C0CC',
          mauve:  '#C07888',
          deep:   '#6B3545',
          gold:   '#C8A860',
          text:   '#261520',
          muted:  '#9A7888',
          border: '#EDE4E6',
          card:   '#FFFFFF',
        },
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
