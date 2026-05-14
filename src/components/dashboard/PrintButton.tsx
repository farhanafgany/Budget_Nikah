'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="bg-nikah-deep text-white font-bold rounded-full text-sm text-center hover:opacity-90 transition print:hidden"
      style={{ padding: '12px 20px' }}
    >
      Print / Simpan PDF
    </button>
  )
}
