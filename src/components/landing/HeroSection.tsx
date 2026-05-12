'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

function PhoneMockup() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError]   = useState(false)

  return (
    <div className="inline-block">
      <div className="bg-nikah-text rounded-[32px] p-1.5 shadow-[0_20px_60px_rgba(107,53,69,0.35)]">
        <div className="bg-nikah-bg rounded-[28px] overflow-hidden w-[200px]">

          {/* Status bar */}
          <div className="bg-nikah-deep px-3 py-2 flex items-center justify-between">
            <span className="text-white text-[8px] font-bold">BudgetNikah</span>
            <span className="text-white/50 text-[7px]" aria-hidden="true">9:41</span>
          </div>

          {/* Score area */}
          <div className="relative h-[220px] bg-gradient-to-b from-[#F5E8EC] to-[#EDD6DE]">
            {!error && (
              <Image
                src="/images/preview-result.png"
                alt="Screenshot hasil analisis BudgetNikah"
                fill
                className={`object-cover object-top transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
              />
            )}
            {(!loaded || error) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-[48px] font-extrabold text-nikah-deep leading-none">73</div>
                <div className="text-[7px] font-bold tracking-widest text-nikah-mauve uppercase mt-1 mb-1.5">
                  Wedding Readiness Score
                </div>
                <span className="inline-block text-[8px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                  Healthy
                </span>
              </div>
            )}
          </div>

          {/* Stat row */}
          <div className="flex border-t border-nikah-border">
            {[
              { val: '4,6jt',  lbl: 'nabung/bln' },
              { val: '18/50',  lbl: 'checklist'  },
              { val: 'Medium', lbl: 'tekanan'     },
            ].map((s, i) => (
              <div
                key={s.lbl}
                className={`flex-1 px-1 py-2 text-center ${i < 2 ? 'border-r border-nikah-border' : ''}`}
              >
                <div className="text-[10px] font-extrabold text-nikah-deep leading-none">{s.val}</div>
                <div className="text-[6px] text-nikah-muted mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden bg-gradient-to-b from-[#F5E8EC] via-[#EDD6DE] to-nikah-bg pt-28 pb-16 px-6 text-center"
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#EDD6DE]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#E8C0CC]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center">

        <p className="text-[10px] font-bold uppercase tracking-widest text-nikah-mauve mb-3">
          Wedding Financial Planner · Indonesia
        </p>

        <h1 className="text-3xl md:text-4xl font-extrabold text-nikah-text leading-tight mb-4">
          Cek Apakah Rencana Weddingmu Sudah Realistis.
        </h1>

        <p className="text-sm md:text-base text-nikah-muted font-light leading-relaxed mb-8 max-w-xs">
          Dapat Wedding Readiness Score, estimasi budget riil, dan rencana nabung — dalam 2 menit.
        </p>

        <div className="mb-8">
          <PhoneMockup />
        </div>

        <Link
          href="/onboarding"
          className="w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center shadow-lg hover:opacity-90 active:scale-95 transition-all mb-3"
        >
          Cek Sekarang — Gratis →
        </Link>
        <p className="text-xs text-nikah-muted">Tanpa login · Selesai 2 menit</p>

      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-4 bg-white/90 backdrop-blur border-t border-nikah-border">
        <Link
          href="/onboarding"
          className="block w-full bg-nikah-deep text-white font-bold py-4 rounded-full text-sm text-center"
        >
          Cek Sekarang — Gratis →
        </Link>
      </div>
    </section>
  )
}
