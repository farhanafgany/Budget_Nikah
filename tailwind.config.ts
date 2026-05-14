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
        background:         'var(--background)',
        foreground:         'var(--foreground)',
        card:               'var(--card)',
        'card-foreground':  'var(--card-foreground)',
        popover:            'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary:            'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary:          'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted:              'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent:             'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive:        'var(--destructive)',
        border:             'var(--border)',
        input:              'var(--input)',
        ring:               'var(--ring)',
        sidebar: {
          DEFAULT:    'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary:    'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent:     'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border:     'var(--sidebar-border)',
          ring:       'var(--sidebar-ring)',
        },
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        jakarta:  ['var(--font-jakarta)', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
