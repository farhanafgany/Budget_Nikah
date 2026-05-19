import Link from 'next/link'

interface Props {
  isSignedIn?: boolean
}

const SERIF = 'var(--font-playfair), "Cormorant Garamond", Georgia, serif'

const PREMIUM_FEATURES = [
  {
    icon: '📋',
    title: 'Checklist Pernikahan',
    body: 'Item tersusun dari 12 bulan hingga H-1 minggu. Ceklis sambil jalan.',
  },
  {
    icon: '💰',
    title: 'Tabungan Nikah',
    body: 'Pantau saldo tabungan vs target. Riwayat input tersimpan.',
  },
  {
    icon: '🧾',
    title: 'Pembayaran Vendor',
    body: 'DP, termin, sisa tagihan, dan jatuh tempo dalam satu tabel.',
  },
  {
    icon: '🔔',
    title: 'Prioritas Sekarang',
    body: 'Gabungan checklist + vendor terdekat. Tahu harus mulai dari mana.',
  },
  {
    icon: '💎',
    title: 'Seserahan Custom',
    body: 'Atur daftar seserahan sesuai kebiasaan keluarga kalian.',
  },
  {
    icon: '📝',
    title: 'Catatan Persiapan',
    body: 'Simpan keputusan, ide, dan detail vendor agar tidak tercecer.',
  },
]

export function PremiumTease({ isSignedIn = false }: Props) {
  const saveHref = '/auth/login?next=/premium'
  const continueHref = '/premium'

  return (
    <section id="premium-details" style={{ marginTop: 36 }}>
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] bg-nikah-deep text-white px-5 py-7 lg:px-9 lg:py-8"
        style={{
          borderRadius: 24,
          gap: 20,
          alignItems: 'center',
          background: 'linear-gradient(160deg, var(--landing-deep, #5A1E2A) 0%, var(--landing-deep-dark, #3D1419) 100%)',
          boxShadow: '0 18px 48px rgba(90,30,42,0.18)',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(24px, 3.7vw, 38px)',
              lineHeight: 1.12,
              margin: 0,
            }}
          >
            Lanjutkan persiapan dengan lebih tenang.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.76)', margin: '10px 0 0', fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>
            Rp 149rb · sekali bayar · akses sampai hari H · garansi 3 hari uang kembali
          </p>
        </div>

        <div className="flex flex-wrap lg:justify-end" style={{ gap: 12 }}>
          <Link
            href={continueHref}
            className="flex-1 lg:flex-none inline-flex items-center justify-center font-extrabold transition hover:brightness-105 active:scale-[0.99]"
            style={{
              minWidth: 0,
              borderRadius: 999,
              padding: '16px 28px',
              color: '#4A1822',
              background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34)',
            }}
          >
            Buka rencana — Rp 149rb ›
          </Link>
        </div>
      </div>

      <div className="text-center mt-10 lg:mt-[72px] mb-6 lg:mb-7">
        <p className="text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 12px' }}>
          Setelah kalian buka
        </p>
        <h2
          className="text-nikah-deep"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(26px, 4.4vw, 48px)',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Semua persiapan kalian dalam satu tempat.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 18 }}>
        {PREMIUM_FEATURES.map((item, i) => (
          <div
            key={item.title}
            className={`bg-white border border-nikah-border${i >= 3 ? ' hidden lg:block' : ''}`}
            style={{
              borderRadius: 20,
              padding: '20px 20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(90,30,42,0.035)',
            }}
          >
            <div className="flex items-start lg:block gap-3">
              <div
                aria-hidden="true"
                className="flex-shrink-0 inline-flex items-center justify-center lg:mb-5"
                style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--landing-pink, #F5E2E2)', fontSize: 20 }}
              >
                {item.icon}
              </div>
              <div className="min-w-0 lg:mt-0" style={{ paddingTop: 1 }}>
                <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 15, lineHeight: 1.25, margin: '0 0 5px' }}>
                  {item.title}
                </h3>
                <p className="text-nikah-muted" style={{ fontSize: 13, lineHeight: 1.55, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block text-center" style={{ marginTop: 64 }}>
        <h2
          className="text-nikah-deep"
          style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(29px, 3.8vw, 40px)', lineHeight: 1.1, margin: '0 0 14px' }}
        >
          Siap lanjutkan persiapan?
        </h2>
        <p className="text-nikah-muted" style={{ fontSize: 16, lineHeight: 1.55, margin: '0 auto 24px', maxWidth: 680 }}>
          Buka dashboard sekarang, atau simpan hasil dulu agar tidak perlu mulai dari awal.
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: 12 }}>
          {!isSignedIn ? (
            <Link
              href={saveHref}
              className="inline-flex items-center justify-center border border-nikah-border text-nikah-deep font-bold rounded-full transition hover:bg-white"
              style={{ minWidth: 230, padding: '17px 28px' }}
            >
              Simpan hasil dulu
            </Link>
          ) : null}
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center bg-nikah-deep text-white font-extrabold rounded-full transition hover:opacity-90"
            style={{ minWidth: 230, padding: '17px 28px' }}
          >
            Lanjutkan sekarang →
          </Link>
        </div>
        <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.5, margin: '18px 0 0' }}>
          ✓ Tanpa langganan · ✓ Garansi 3 hari refund · ✓ Pembayaran via Midtrans Snap
        </p>
      </div>
    </section>
  )
}
