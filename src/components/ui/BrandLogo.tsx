interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const SIZE_MAP = {
  sm: { mark: 22, font: 13 },
  md: { mark: 28, font: 15 },
  lg: { mark: 40, font: 22 },
}

function LogoArch({
  size = 28,
  color = 'var(--nikah-deep)',
  accent = 'var(--nikah-mauve)',
}: {
  size?: number
  color?: string
  accent?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path
        d="M5 30 V 18 C 5 10 11 5 18 5 C 25 5 31 10 31 18 V 30"
        stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      <path
        d="M11 30 V 22 C 11 18 14 16 18 16 C 22 16 25 18 25 22 V 30"
        stroke={accent} strokeWidth="2" strokeLinecap="round" fill="none"
      />
      <circle cx="18" cy="11" r="1.8" fill={accent} />
    </svg>
  )
}

export function BrandLogo({ size = 'md', color }: Props) {
  const s = SIZE_MAP[size]
  const textColor = color ?? 'var(--nikah-text)'
  return (
    <span
      className="inline-flex items-center gap-2 select-none"
      style={{ color: textColor }}
    >
      <LogoArch size={s.mark} color={color ?? 'var(--nikah-deep)'} />
      <span
        className="font-extrabold tracking-tight"
        style={{ fontSize: s.font }}
      >
        BudgetNikah
      </span>
    </span>
  )
}
