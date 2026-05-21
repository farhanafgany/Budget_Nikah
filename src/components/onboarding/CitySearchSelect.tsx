'use client'
import { useState, useRef, useEffect } from 'react'
import { TIER_A_CITIES, TIER_B_CITIES, TIER_C_CITIES } from '@/lib/cityTiers'

const GROUPS = [
  { label: 'Kota Besar', cities: TIER_A_CITIES },
  { label: 'Kota Menengah', cities: TIER_B_CITIES },
  { label: 'Kota Lainnya', cities: TIER_C_CITIES },
]

interface Props {
  value: string
  onChange: (city: string) => void
}

export function CitySearchSelect({ value, onChange }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const q = query.trim().toLowerCase()
  const filtered = GROUPS.map(g => ({
    label: g.label,
    cities: g.cities.filter(c => c.toLowerCase().includes(q)),
  })).filter(g => g.cities.length > 0)

  function handleSelect(city: string) {
    onChange(city)
    setQuery('')
    setOpen(false)
  }

  function handleInputFocus() {
    setOpen(true)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (!open) setOpen(true)
  }

  // Tutup saat klik di luar
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const displayValue = value && !open ? value : query

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Ketik nama kota..."
        className="w-full bg-white border border-nikah-border rounded-xl px-4 py-3 text-sm text-nikah-text placeholder:text-nikah-muted focus:outline-none focus:border-nikah-mauve transition"
      />
      {value && !open && (
        <button
          type="button"
          onClick={() => { onChange(''); setQuery(''); inputRef.current?.focus() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-nikah-muted hover:text-nikah-text transition text-lg leading-none"
          aria-label="Hapus pilihan"
        >
          ×
        </button>
      )}

      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-nikah-border rounded-xl overflow-hidden z-50"
          style={{ maxHeight: 280, overflowY: 'auto', boxShadow: '0 8px 24px rgba(90,30,42,0.12)' }}
        >
          {filtered.length === 0 ? (
            <p className="text-nikah-muted text-sm px-4 py-3">Kota tidak ditemukan.</p>
          ) : (
            filtered.map(group => (
              <div key={group.label}>
                <p className="text-nikah-muted text-xs font-bold uppercase tracking-widest px-4 pt-3 pb-1" style={{ letterSpacing: '0.1em' }}>
                  {group.label}
                </p>
                {group.cities.map(city => (
                  <button
                    key={city}
                    type="button"
                    onPointerDown={e => { e.preventDefault(); handleSelect(city) }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition ${
                      city === value
                        ? 'bg-[#F5E8EC] text-nikah-deep font-bold'
                        : 'text-nikah-text hover:bg-nikah-bg'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
