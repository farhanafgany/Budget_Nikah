'use client'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { AllocationResult } from '@/lib/allocation'

const COLORS = ['#C07888','#E8C0CC','#D4A0B0','#B06070','#C8A860','#A08870','#D0B890','#8B6080']
const LABELS: Record<keyof AllocationResult, string> = {
  catering:'Catering', venue:'Venue', decoration:'Dekorasi',
  documentation:'Dokumentasi', mua:'MUA', souvenir:'Souvenir',
  entertainment:'Hiburan', emergencyFund:'Dana Darurat',
}

export default function AllocationChart({ allocation }: { allocation: AllocationResult }) {
  const data = Object.entries(allocation).map(([key, val], i) => ({
    name: LABELS[key as keyof AllocationResult],
    value: val.percentage,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className="bg-white rounded-2xl p-5 border border-nikah-border shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest text-nikah-mauve mb-4">Alokasi Budget</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => v != null ? `${v}%` : ''} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-nikah-muted">{d.name} {d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
