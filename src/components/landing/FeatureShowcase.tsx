'use client'
import Image from 'next/image'
import { useState } from 'react'

const TABS = [
  {
    id:              'score',
    label:           '📊 Score',
    eyebrow:         'Fitur Utama',
    title:           'Wedding Readiness Score',
    description:     'Tidak perlu tebak-tebak lagi. Masukkan data weddingmu, dapat angka 0–100 yang jelas kenapa segitu — bukan angka random.',
    bullets:         ['Deterministik & explainable', 'Breakdown per faktor', 'Update real-time saat simulasi'],
    imageSrc:        '/images/feature-score.png',
    imageAlt:        'Screenshot Wedding Readiness Score',
    screenshotTitle: 'Hasil Analisis',
  },
  {
    id:              'tabungan',
    label:           '💰 Tabungan',
    eyebrow:         'Tracker Keuangan',
    title:           'Tabungan Nikah',
    description:     'Pantau progress tabungan dan tahu harus nabung berapa per bulan supaya target tercapai tepat waktu.',
    bullets:         ['Target otomatis dari total budget', 'Progress bar visual', 'Kalkulasi sisa bulan'],
    imageSrc:        '/images/feature-tabungan.png',
    imageAlt:        'Screenshot Tabungan Nikah',
    screenshotTitle: 'Tabungan Nikah',
  },
  {
    id:              'checklist',
    label:           '✅ Checklist',
    eyebrow:         'Timeline Persiapan',
    title:           'Checklist 50+ Item',
    description:     'Timeline dari 12 bulan sampai H-1 minggu. Tidak ada yang terlewat.',
    bullets:         ['Diurutkan per fase waktu', 'Centang satu per satu', 'Filter per timeline'],
    imageSrc:        '/images/feature-checklist.png',
    imageAlt:        'Screenshot Checklist Pernikahan',
    screenshotTitle: 'Checklist Pernikahan',
  },
  {
    id:              'seserahan',
    label:           '💍 Seserahan',
    eyebrow:         'Daftar Seserahan',
    title:           'Seserahan List',
    description:     'Semua item seserahan dalam satu daftar lengkap, dengan status sudah/belum untuk tiap item.',
    bullets:         ['20+ item default', 'Tandai sudah/belum', 'Ringkasan progress'],
    imageSrc:        '/images/feature-seserahan.png',
    imageAlt:        'Screenshot Seserahan List',
    screenshotTitle: 'Daftar Seserahan',
  },
]

function ScreenshotSlot({
  src, alt, title,
}: {
  src:   string
  alt:   string
  title: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  return (
    <div className="border border-nikah-border rounded-2xl overflow-hidden shadow-md bg-white flex-shrink-0 w-full md:w-[280px]">
      <div className="bg-nikah-deep px-4 py-2.5">
        <span className="text-white text-[10px] font-bold">{title}</span>
      </div>
      <div className="relative h-[220px] md:h-[340px] bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE]">
        {!error && (
          <Image
            src={src}
            alt={alt}
            fill
            className={`object-cover object-top transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        )}
        {(!loaded || error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center px-4">
            <div className="text-xs font-bold text-nikah-deep">{title}</div>
            <div className="text-[10px] text-nikah-muted">{alt}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export function FeatureShowcase() {
  const [active, setActive] = useState(0)
  const tab = TABS[active]

  return (
    <section id="fitur" className="px-6 py-20 bg-nikah-bg">
      <div className="max-w-3xl mx-auto">

        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Semua dalam satu tempat
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-nikah-text text-center mb-8">
          Yang kamu dapat
        </h2>

        {/* Tab strip */}
        <div className="flex bg-white border border-nikah-border rounded-full p-1 mb-8 gap-1">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`flex-1 py-2 px-1 rounded-full text-[11px] font-semibold transition-all ${
                active === i
                  ? 'bg-nikah-deep text-white'
                  : 'text-nikah-muted hover:text-nikah-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panel — stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-12">
          <div className="flex-1 mb-6 md:mb-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-mauve mb-2">
              {tab.eyebrow}
            </p>
            <h3 className="text-xl md:text-2xl font-extrabold text-nikah-text mb-3">{tab.title}</h3>
            <p className="text-sm md:text-base text-nikah-muted font-light leading-relaxed mb-6">
              {tab.description}
            </p>
            <ul className="space-y-3" aria-label={`Fitur ${tab.title}`}>
              {tab.bullets.map(b => (
                <li key={b} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base font-medium text-nikah-text">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <ScreenshotSlot src={tab.imageSrc} alt={tab.imageAlt} title={tab.screenshotTitle} />
        </div>

      </div>
    </section>
  )
}
