import Link from 'next/link'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { Footer } from '@/components/landing/Footer'

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  description: string
  updatedAt: string
  children: React.ReactNode
}

export function LegalPageLayout({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="landing-theme min-h-screen bg-nikah-bg">
      <header className="border-b border-nikah-border bg-white/80">
        <div className="mx-auto flex h-16 max-w-[960px] items-center justify-between px-5">
          <Link href="/" className="inline-flex" aria-label="Kembali ke BudgetNikah">
            <BrandLogo size="md" />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-nikah-border bg-white px-4 py-2 text-xs font-bold text-nikah-deep transition-colors hover:bg-nikah-bg md:text-sm"
          >
            Beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[840px] px-5 py-12 md:px-8 md:py-16">
        <section className="mb-10 md:mb-12">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-nikah-mauve">
            {eyebrow}
          </p>
          <h1 className="max-w-[720px] text-4xl font-extrabold leading-tight text-nikah-deep md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[700px] text-base leading-7 text-nikah-muted md:text-lg">
            {description}
          </p>
          <p className="mt-4 text-sm font-semibold text-nikah-text">
            Terakhir diperbarui: {updatedAt}
          </p>
        </section>

        <div className="space-y-5 md:space-y-6">{children}</div>
      </main>

      <Footer />
    </div>
  )
}

type LegalSectionProps = {
  title: string
  children: React.ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="rounded-2xl border border-nikah-border bg-white p-5 shadow-[var(--shadow-sm)] md:p-7">
      <h2 className="text-xl font-extrabold text-nikah-text md:text-2xl">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-7 text-nikah-muted md:text-base">
        {children}
      </div>
    </section>
  )
}

type SimpleListProps = {
  items: string[]
}

export function SimpleList({ items }: SimpleListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-nikah-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
