'use client'
import Image from 'next/image'
import { useState } from 'react'

const FEATURE_IMAGES = [
  { src: '/images/feature-score.png',     alt: 'Wedding Readiness Score', label: '📊 Score' },
  { src: '/images/feature-tabungan.png',  alt: 'Tabungan Nikah',          label: '💰 Tabungan' },
  { src: '/images/feature-checklist.png', alt: 'Checklist Pernikahan',    label: '✅ Checklist' },
  { src: '/images/feature-seserahan.png', alt: 'Seserahan List',          label: '💍 Seserahan' },
]

const SPILL_ITEMS = [
  'Wedding Readiness Score (0–100)',
  'Estimasi biaya riil per kategori (dalam Rupiah)',
  'Kalkulasi nabung/bulan otomatis',
  'Checklist 50+ item berbasis timeline',
  'Tabungan Nikah tracker',
  'Daftar Seserahan lengkap',
]

function FeatureSlot({ src, alt, label }: { src: string; alt: string; label: string }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div className="relative w-full h-14 bg-[#EDD6DE] rounded-lg overflow-hidden flex items-center justify-center">
      {!imgError && (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
      {(!imgLoaded || imgError) && (
        <span className="text-[10px] text-nikah-mauve font-medium relative z-10">{label}</span>
      )}
    </div>
  )
}

export function FeatureShowcase() {
  return (
    <section className="px-6 py-16 bg-nikah-bg">
      <div className="max-w-md mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-nikah-mauve text-center mb-2">
          Semua dalam satu dashboard
        </p>
        <h2 className="text-2xl font-extrabold text-nikah-text text-center mb-10">
          Yang kamu dapat:
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Phone mockup */}
          <div className="flex-shrink-0 w-[200px]">
            <div className="bg-nikah-text rounded-[30px] p-2 shadow-2xl">
              <div className="bg-nikah-bg rounded-[24px] overflow-hidden">
                {/* Status bar */}
                <div className="bg-nikah-deep px-4 py-2.5 flex items-center justify-between">
                  <span className="text-white text-[10px] font-bold">BudgetNikah</span>
                  <span className="text-white/60 text-[9px]" aria-hidden="true">9:41</span>
                </div>
                {/* Feature slots */}
                <div className="p-2 space-y-1.5">
                  {FEATURE_IMAGES.map(f => (
                    <FeatureSlot key={f.src} {...f} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Spill list */}
          <div className="flex-1 flex flex-col justify-center">
            <ul className="space-y-3" aria-label="Daftar fitur">
              {SPILL_ITEMS.map(item => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-nikah-deep flex-shrink-0 flex items-center justify-center mt-0.5" aria-hidden="true">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-nikah-text font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
