'use client'

import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { track } from '@/lib/analytics'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DACF] bg-white/75 px-3 py-1.5 text-[11px] font-semibold text-[#6E5359]">
      <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#8A5A65]" />
      {children}
    </span>
  )
}

export function MobileHero() {
  return (
    <div className="md:hidden">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8DACF] bg-white/75 px-3 py-1.5 text-[12px] font-semibold text-[#7B5C60]">
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-[#B98C54]" />
        Simulasi dulu, tanpa daftar
      </div>

      <h1
        className="max-w-[340px] text-[37px] font-medium italic leading-[1.01] text-[#3D1419]"
        style={{ fontFamily: SERIF }}
      >
        Paket terlihat cocok. Tapi aman tidak buat cashflow kalian?
      </h1>

      <p className="mt-3 max-w-[330px] text-[14.5px] leading-6 text-[#6E5359]">
        Masukkan budget, tamu, kota, dan gaya acara. BudgetNikah bantu membaca mana keputusan yang terasa cantik tapi berat di belakang.
      </p>

      <div className="mt-5 rounded-[8px] border border-[#E2CFC3] bg-[#FFF9F3] p-4 shadow-[0_16px_38px_rgba(90,30,42,0.095)]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#A38B89]">Contoh bacaan</p>
            <p className="mt-1 text-[14px] font-extrabold text-[#3D1419]">Dekor premium + tamu 500</p>
          </div>
          <span className="rounded-full bg-[#F7E7E4] px-3 py-1.5 text-[12px] font-bold text-[#9D3441]">Perlu dicek</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="mb-1.5 flex justify-between text-[12px] font-semibold text-[#6E5359]">
              <span>Budget terpakai</span>
              <span>91%</span>
            </div>
            <div className="h-2 rounded-full bg-[#F1E5DE]">
              <div className="h-2 w-[91%] rounded-full bg-[#9D3441]" />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex justify-between text-[12px] font-semibold text-[#6E5359]">
              <span>Ruang dana darurat</span>
              <span>6%</span>
            </div>
            <div className="h-2 rounded-full bg-[#F1E5DE]">
              <div className="h-2 w-[36%] rounded-full bg-[#C9A961]" />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[8px] border border-[#E8DACF] bg-white/80 p-3">
          <div className="flex items-start gap-2.5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#8A5A65]" />
            <p className="text-[12.5px] leading-5 text-[#6E5359]">
              Saran awal: kunci jumlah tamu dulu, baru naikkan dekor kalau sisa budget masih terasa aman.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <TrustPill>Gratis cek awal</TrustPill>
        <TrustPill>2 menit</TrustPill>
        <TrustPill>Tanpa kartu kredit</TrustPill>
      </div>

      <Link
        href="/onboarding"
        onClick={() => track('landing_cta_clicked', {
          cta_location: 'mobile_hero',
          target: 'onboarding',
          hero_variant: 'decision_soft',
        })}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3D1419] px-5 text-center text-sm font-bold text-white shadow-[0_12px_28px_rgba(90,30,42,0.2)] transition active:scale-[0.98]"
      >
        Cek rencana kalian
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>

      <p className="mt-3 text-center text-[12px] leading-5 text-[#A38B89]">
        Hasil awal langsung terlihat. Login hanya kalau lanjut ke dashboard.
      </p>
    </div>
  )
}
