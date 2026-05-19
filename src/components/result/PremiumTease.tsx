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
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] bg-nikah-deep text-white"
        style={{
          borderRadius: 24,
          padding: '32px 36px',
          gap: 24,
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
              fontSize: 'clamp(28px, 3.7vw, 38px)',
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Lanjutkan persiapan dengan lebih tenang.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.76)', margin: '12px 0 0', fontSize: 15, lineHeight: 1.55, maxWidth: 640 }}>
            Rp 149rb · sekali bayar · akses sampai hari H · garansi 3 hari uang kembali
          </p>
        </div>

        <div className="flex flex-wrap justify-end" style={{ gap: 12 }}>
          <Link
            href={continueHref}
            className="inline-flex items-center justify-center font-extrabold transition hover:brightness-105 active:scale-[0.99]"
            style={{
              minWidth: 286,
              borderRadius: 999,
              padding: '18px 30px',
              color: '#4A1822',
              background: 'linear-gradient(180deg, #E8D7A8 0%, #C9A961 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34)',
            }}
          >
            Buka rencana — Rp 149rb ›
          </Link>
        </div>
      </div>

      <div className="text-center" style={{ marginTop: 72, marginBottom: 28 }}>
        <p className="text-xs font-extrabold uppercase text-nikah-mauve" style={{ letterSpacing: '0.18em', margin: '0 0 14px' }}>
          Setelah kalian buka
        </p>
        <h2
          className="text-nikah-deep"
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 'clamp(32px, 4.4vw, 48px)',
            lineHeight: 1.08,
            margin: 0,
          }}
        >
          Semua persiapan kalian dalam satu tempat.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 18 }}>
        {PREMIUM_FEATURES.map(item => (
          <div
            key={item.title}
            className="bg-white border border-nikah-border"
            style={{
              borderRadius: 20,
              padding: '26px 24px',
              minHeight: 144,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(90,30,42,0.035)',
            }}
          >
            <div
              aria-hidden="true"
              className="inline-flex items-center justify-center"
              style={{ width: 42, height: 42, borderRadius: 14, background: 'var(--landing-pink, #F5E2E2)', fontSize: 22, marginBottom: 20 }}
            >
              {item.icon}
            </div>
            <h3 className="text-nikah-text font-extrabold" style={{ fontSize: 17, lineHeight: 1.25, margin: '0 0 9px' }}>
              {item.title}
            </h3>
            <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              {item.body}
            </p>
            {item.title === 'Prioritas Sekarang' ? (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  bottom: 18,
                  height: 30,
                  borderRadius: 12,
                  background: 'linear-gradient(180deg, rgba(251,246,241,0.38), rgba(251,246,241,0.96))',
                  backdropFilter: 'blur(2px)',
                  pointerEvents: 'none',
                }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="text-center" style={{ marginTop: 64 }}>
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
            Buka rencana — Rp 149rb
          </Link>
        </div>
        <p className="text-nikah-muted" style={{ fontSize: 14, lineHeight: 1.5, margin: '18px 0 0' }}>
          ✓ Tanpa langganan · ✓ Garansi 3 hari refund · ✓ Pembayaran via Midtrans Snap
        </p>
      </div>
    </section>
  )
}
