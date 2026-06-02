'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundX,
  type LucideIcon,
} from 'lucide-react'
import { track } from '@/lib/analytics'

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

function TrustPill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-[#E8DACF] bg-white/55 px-2 py-2.5 text-[10.5px] font-bold text-[#5A1E2A] min-[420px]:gap-2 min-[420px]:text-[11.5px]">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#7A3542]" />
      <span className="whitespace-nowrap">{children}</span>
    </span>
  )
}

export function MobileHero() {
  return (
    <div className="md:hidden">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#E8DACF] bg-white/70 px-3.5 py-2 text-[11.5px] font-semibold text-[#7B5C60] shadow-[0_3px_10px_rgba(90,30,42,0.04)]">
        <Sparkles aria-hidden="true" className="h-4 w-4 text-[#B98C54]" />
        Gratis simulasi 2 menit
      </div>

      <h1
        className="mt-5 text-[42px] font-medium italic leading-[0.98] tracking-[-1.25px] text-[#3D1419] min-[420px]:text-[46px]"
        style={{ fontFamily: SERIF }}
      >
        <span className="block">Cek apakah</span>
        <span className="block">budget nikah</span>
        <span className="block">
          kalian <span className="text-[#B94F5B]">realistis</span>
        </span>
      </h1>

      <p className="mt-4 text-[14px] leading-6 text-[#7B6466] min-[420px]:text-[14.5px]">
        Simulasikan biaya, jumlah tamu, dan gaya acara sebelum booking vendor atau ambil keputusan besar.
      </p>

      <div className="mt-5 rounded-[20px] border border-[#E7CFC2] bg-white/45 p-4 shadow-[0_18px_42px_rgba(90,30,42,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F8ECE5]">
              <ChartNoAxesCombined aria-hidden="true" className="h-5 w-5 text-[#C58A58]" />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-[#3D1419] min-[420px]:text-[14px]">Preview simulasi</p>
              <p className="truncate text-[11.5px] text-[#7B6466] min-[420px]:text-[12.5px]">Dekor premium • 500 tamu</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-[#F8E5E4] px-2.5 py-1.5 text-[10.5px] font-bold text-[#B83F4B] min-[420px]:text-[11.5px]">
            Perlu dicek
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[11.5px] font-bold text-[#6E5359]">
            <span>Budget terpakai</span>
            <span>91%</span>
          </div>
          <div className="h-2 rounded-full bg-[#EFE3DE]">
            <div className="h-2 w-[91%] rounded-full bg-gradient-to-r from-[#A62739] to-[#B12D3E]" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-[#EADDD6] pt-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF3EF]">
            <ShieldCheck aria-hidden="true" className="h-5 w-5 text-[#5A1E2A]" />
          </span>
          <p className="min-w-0 flex-1 text-[11.5px] leading-[1.55] text-[#7B6466] min-[420px]:text-[12px]">
            Saran awal: kurangi jumlah tamu atau pilih dekor yang lebih efisien.
          </p>
          <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-[#8A656A]" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <TrustPill icon={CheckCircle2}>Gratis</TrustPill>
        <TrustPill icon={Clock3}>2 menit</TrustPill>
        <TrustPill icon={UserRoundX}>Tanpa login</TrustPill>
      </div>

      <Link
        href="/onboarding"
        onClick={() => track('landing_cta_clicked', {
          cta_location: 'mobile_hero',
          target: 'onboarding',
          hero_variant: 'realistic_preview',
        })}
        className="mt-5 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[16px] bg-gradient-to-r from-[#5A1E2A] to-[#681B27] px-5 text-center text-[14px] font-bold text-white shadow-[0_14px_28px_rgba(90,30,42,0.18)] transition active:scale-[0.98]"
      >
        Mulai simulasi gratis
        <ArrowRight aria-hidden="true" className="h-5 w-5" />
      </Link>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] leading-5 text-[#A38B89] min-[420px]:text-[11.5px]">
        <LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0" />
        Lihat hasil awal langsung — tanpa daftar.
      </p>
    </div>
  )
}
