'use client'
import { useState, useTransition } from 'react'
import { updateVendorPayments, type VendorPaymentInput } from '@/app/dashboard/actions'
import { formatRupiah } from '@/lib/utils'
import { getVendorPaymentStatus } from '@/lib/vendorPayments'
import { BriefcaseBusiness, ChevronDown, Plus, Trash2 } from 'lucide-react'

interface Props {
  initialPayments: VendorPaymentInput[]
}

const CATEGORIES = ['Venue', 'Catering', 'Dekorasi', 'MUA', 'Dokumentasi', 'Hiburan', 'Lainnya']

function parseAmount(value: string) {
  return parseInt(value.replace(/\D/g, ''), 10) || 0
}

function formatInput(value: string | number) {
  const n = parseAmount(String(value))
  return n ? new Intl.NumberFormat('id-ID').format(n) : ''
}

export function VendorPaymentTracker({ initialPayments }: Props) {
  const [payments, setPayments] = useState<VendorPaymentInput[]>(initialPayments)
  const [formOpen, setFormOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    category: CATEGORIES[0],
    totalAmount: '',
    paidAmount: '',
    dueDate: '',
  })
  const [installmentDraft, setInstallmentDraft] = useState({ vendorId: '', amount: '' })
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const total = payments.reduce((sum, item) => sum + item.totalAmount, 0)
  const paid = payments.reduce((sum, item) => sum + item.paidAmount, 0)
  const remaining = Math.max(0, total - paid)
  const visiblePayments = payments.slice(0, 4)

  function persist(next: VendorPaymentInput[]) {
    setPayments(next)
    setError('')
    startTransition(async () => {
      const result = await updateVendorPayments(next)
      if (result.error) setError('Pembayaran vendor belum tersimpan.')
    })
  }

  function handleAdd() {
    const totalAmount = parseAmount(draft.totalAmount)
    const paidAmount = Math.min(parseAmount(draft.paidAmount), totalAmount)
    if (!draft.name.trim() || totalAmount <= 0) {
      setError('Isi nama vendor dan total biaya dulu.')
      return
    }

    persist([
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        category: draft.category,
        totalAmount,
        paidAmount,
        dueDate: draft.dueDate,
        installments: paidAmount > 0
          ? [{ id: crypto.randomUUID(), amount: paidAmount, date: new Date().toISOString().slice(0, 10) }]
          : [],
      },
      ...payments,
    ])
    setDraft({ name: '', category: CATEGORIES[0], totalAmount: '', paidAmount: '', dueDate: '' })
    setFormOpen(false)
  }

  function markPaid(id: string) {
    persist(payments.map(item => {
      if (item.id !== id) return item
      const amount = Math.max(0, item.totalAmount - item.paidAmount)
      return {
        ...item,
        paidAmount: item.totalAmount,
        installments: amount > 0
          ? [...(item.installments ?? []), { id: crypto.randomUUID(), amount, date: new Date().toISOString().slice(0, 10) }]
          : item.installments,
      }
    }))
  }

  function removePayment(id: string) {
    persist(payments.filter(item => item.id !== id))
  }

  function addInstallment(id: string) {
    const amount = parseAmount(installmentDraft.amount)
    const vendor = payments.find(item => item.id === id)
    if (!vendor) return

    const remaining = Math.max(0, vendor.totalAmount - vendor.paidAmount)
    if (amount <= 0) {
      setError('Isi nominal pembayaran dulu.')
      return
    }
    if (remaining <= 0) {
      setError('Vendor ini sudah lunas.')
      return
    }

    const cappedAmount = Math.min(amount, remaining)
    persist(payments.map(item => item.id === id ? {
      ...item,
      paidAmount: item.paidAmount + cappedAmount,
      installments: [
        ...(item.installments ?? []),
        { id: crypto.randomUUID(), amount: cappedAmount, date: new Date().toISOString().slice(0, 10) },
      ],
    } : item))
    setInstallmentDraft({ vendorId: '', amount: '' })
  }

  return (
    <div
      className="bg-white border shadow-sm"
      style={{
        borderRadius: 'var(--d-radius)',
        padding: 'var(--d-pad-card)',
        borderColor: 'rgba(200,168,96,0.34)',
        boxShadow: '0 12px 30px rgba(107,53,69,0.06)',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
        <span className="inline-flex items-center" style={{ gap: 8 }}>
          <span
            className="inline-flex items-center justify-center text-nikah-deep"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #F5E8EC, #EDD6DE)',
            }}
          >
            <BriefcaseBusiness size={16} strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-nikah-mauve">
            Pembayaran Vendor
          </span>
        </span>
        <span
          className="text-xs font-extrabold rounded-full"
          style={{ color: 'var(--nikah-deep)', background: 'var(--nikah-bg)', padding: '5px 10px' }}
        >
          {payments.length} vendor
        </span>
      </div>

      <div className="grid grid-cols-3" style={{ gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Total', value: formatRupiah(total) },
          { label: 'Terbayar', value: formatRupiah(paid) },
          { label: 'Sisa', value: formatRupiah(remaining) },
        ].map(item => (
          <div key={item.label} className="bg-nikah-bg" style={{ borderRadius: 12, padding: '10px 12px' }}>
            <div className="font-extrabold text-nikah-deep" style={{ fontSize: 14, lineHeight: 1.1 }}>{item.value}</div>
            <div className="text-nikah-muted" style={{ fontSize: 10, marginTop: 3 }}>{item.label}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFormOpen(value => !value)}
        aria-expanded={formOpen}
        className="w-full inline-flex items-center justify-center text-nikah-deep font-bold transition-colors hover:bg-nikah-bg"
        style={{
          gap: 6,
          marginBottom: formOpen ? 10 : 12,
          padding: '10px 14px',
          border: '1px solid var(--nikah-border)',
          borderRadius: 999,
          fontSize: 12,
          background: 'transparent',
        }}
      >
        <Plus size={14} />
        Tambah Vendor
        <ChevronDown
          size={15}
          style={{
            transform: formOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
      </button>

      {formOpen && (
        <div className="grid bg-nikah-bg" style={{ gap: 8, marginBottom: 12, padding: 12, borderRadius: 16 }}>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Nama vendor"
            className="w-full border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
            style={{ borderRadius: 12, padding: '11px 12px', fontSize: 13 }}
          />
          <div className="grid grid-cols-2" style={{ gap: 8 }}>
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              className="w-full border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
              style={{ borderRadius: 12, padding: '11px 12px', fontSize: 13 }}
            >
              {CATEGORIES.map(category => <option key={category}>{category}</option>)}
            </select>
            <input
              type="date"
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              className="w-full border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
              style={{ borderRadius: 12, padding: '10px 12px', fontSize: 13 }}
            />
          </div>
          <div className="grid grid-cols-2" style={{ gap: 8 }}>
            <input
              inputMode="numeric"
              value={draft.totalAmount}
              onChange={(e) => setDraft({ ...draft, totalAmount: formatInput(e.target.value) })}
              placeholder="Total biaya"
              className="w-full border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
              style={{ borderRadius: 12, padding: '11px 12px', fontSize: 13 }}
            />
            <input
              inputMode="numeric"
              value={draft.paidAmount}
              onChange={(e) => setDraft({ ...draft, paidAmount: formatInput(e.target.value) })}
              placeholder="DP / sudah bayar"
              className="w-full border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
              style={{ borderRadius: 12, padding: '11px 12px', fontSize: 13 }}
            />
          </div>
          <div className="grid grid-cols-[1fr_auto]" style={{ gap: 8 }}>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending}
              className="bg-nikah-deep text-white font-bold disabled:opacity-50"
              style={{ border: 0, borderRadius: 999, padding: '12px 18px', fontSize: 13 }}
            >
              {isPending ? 'Menyimpan...' : 'Simpan Vendor'}
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-nikah-deep font-bold hover:bg-white"
              style={{ border: '1px solid var(--nikah-border)', borderRadius: 999, padding: '12px 16px', fontSize: 13, background: 'transparent' }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600" style={{ margin: '0 0 8px' }}>{error}</p>}

      <div className="grid" style={{ gap: 2 }}>
        {visiblePayments.length === 0 && (
          <div className="bg-nikah-bg text-center" style={{ borderRadius: 14, padding: '16px 14px' }}>
            <p className="text-sm text-nikah-text font-bold" style={{ margin: 0 }}>Belum ada vendor.</p>
            <p className="text-xs text-nikah-muted" style={{ margin: '4px 0 0' }}>Tambahkan vendor pertama untuk mulai tracking DP dan pelunasan.</p>
          </div>
        )}
        {visiblePayments.map(item => {
          const itemRemaining = Math.max(0, item.totalAmount - item.paidAmount)
          const paidPercent = item.totalAmount > 0
            ? Math.min(100, Math.round((item.paidAmount / item.totalAmount) * 100))
            : 0
          const status = getVendorPaymentStatus(item)
          return (
            <div
              key={item.id}
              className="hover:bg-nikah-bg"
              style={{
                padding: '12px 10px',
                borderRadius: 12,
                borderBottom: '1px solid var(--nikah-border)',
              }}
            >
              <div className="flex items-start justify-between" style={{ gap: 10 }}>
                <div className="min-w-0">
                  <div className="font-bold text-nikah-text truncate" style={{ fontSize: 14, lineHeight: 1.25 }}>{item.name}</div>
                  <div className="text-nikah-muted" style={{ fontSize: 11, marginTop: 3 }}>
                    {item.category}
                    {item.dueDate ? ` · jatuh tempo ${new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` : ''}
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 6, flexShrink: 0 }}>
                  <span
                    className="font-extrabold rounded-full"
                    style={{
                      color: status.color,
                      background: status.background,
                      fontSize: 10,
                      padding: '3px 7px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {status.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePayment(item.id)}
                    className="inline-flex text-nikah-muted hover:text-nikah-deep"
                    style={{ border: 0, background: 'transparent', padding: 2 }}
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="bg-white" style={{ height: 6, borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${paidPercent}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, var(--nikah-mauve), var(--nikah-gold))',
                  }}
                />
              </div>

              <div className="flex items-center justify-between" style={{ gap: 10, marginTop: 8 }}>
                <div className="text-nikah-muted" style={{ fontSize: 11, lineHeight: 1.35 }}>
                  <span className="font-bold text-nikah-text">{formatRupiah(item.paidAmount)}</span> terbayar
                  <span> · sisa {formatRupiah(itemRemaining)}</span>
                  {(item.installments?.length ?? 0) > 0 && (
                    <span> · {item.installments?.length} pembayaran</span>
                  )}
                </div>

                {itemRemaining > 0 && installmentDraft.vendorId !== item.id && (
                  <div className="flex items-center" style={{ gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setInstallmentDraft({ vendorId: item.id, amount: '' })}
                      className="text-nikah-deep font-bold"
                      style={{ border: 0, background: 'transparent', fontSize: 11, padding: 0 }}
                    >
                      Catat Bayar
                    </button>
                    <button
                      type="button"
                      onClick={() => markPaid(item.id)}
                      className="text-nikah-deep font-bold"
                      style={{ border: 0, background: 'transparent', fontSize: 11, padding: 0 }}
                    >
                      Lunas
                    </button>
                  </div>
                )}
              </div>

              {itemRemaining > 0 && installmentDraft.vendorId === item.id && (
                <div className="grid grid-cols-[1fr_auto_auto]" style={{ gap: 8, marginTop: 10 }}>
                  <input
                    inputMode="numeric"
                    value={installmentDraft.amount}
                    onChange={(e) => setInstallmentDraft({ vendorId: item.id, amount: formatInput(e.target.value) })}
                    placeholder="Nominal bayar"
                    className="border border-nikah-border bg-white text-nikah-text outline-none focus:border-nikah-mauve"
                    style={{ minWidth: 0, borderRadius: 999, padding: '9px 12px', fontSize: 12 }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => addInstallment(item.id)}
                    className="bg-nikah-deep text-white font-bold"
                    style={{ border: 0, borderRadius: 999, padding: '9px 12px', fontSize: 11 }}
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setInstallmentDraft({ vendorId: '', amount: '' })}
                    className="text-nikah-deep font-bold"
                    style={{ border: '1px solid var(--nikah-border)', background: 'transparent', borderRadius: 999, padding: '9px 12px', fontSize: 11 }}
                  >
                    Batal
                  </button>
                </div>
              )}
            </div>
          )
        })}
        {payments.length > 4 && (
          <p className="text-xs text-nikah-muted text-center" style={{ margin: '8px 0 0' }}>
            Menampilkan 4 vendor terbaru dari {payments.length} vendor.
          </p>
        )}
      </div>
    </div>
  )
}
