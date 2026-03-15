import type { DanceStyle } from '@/lib/types'

const STYLE_CONFIG: Record<DanceStyle, { label: string; className: string }> = {
  bachata:  { label: 'Bachata',  className: 'bg-rose-100 text-rose-700' },
  salsa:    { label: 'Salsa',    className: 'bg-orange-100 text-orange-700' },
  kizomba:  { label: 'Kizomba', className: 'bg-purple-100 text-purple-700' },
  zouk:     { label: 'Zouk',    className: 'bg-blue-100 text-blue-700' },
  other:    { label: 'Other',   className: 'bg-gray-100 text-gray-600' },
}

export function StyleBadge({ style }: { style: DanceStyle }) {
  const { label, className } = STYLE_CONFIG[style]
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
