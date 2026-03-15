'use client'

import type { StyleFilter, TypeFilter } from '@/lib/types'

const STYLE_OPTIONS: { value: StyleFilter; label: string }[] = [
  { value: 'all',     label: 'All styles' },
  { value: 'bachata', label: 'Bachata' },
  { value: 'salsa',   label: 'Salsa' },
  { value: 'kizomba', label: 'Kizomba' },
  { value: 'zouk',    label: 'Zouk' },
]

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all',      label: 'All types' },
  { value: 'party',    label: 'Party' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'festival', label: 'Festival' },
  { value: 'practice', label: 'Practice' },
]

interface FilterBarProps {
  styleFilter: StyleFilter
  typeFilter: TypeFilter
  onStyleChange: (v: StyleFilter) => void
  onTypeChange: (v: TypeFilter) => void
}

function FilterGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition
            ${value === opt.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function FilterBar({ styleFilter, typeFilter, onStyleChange, onTypeChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <FilterGroup options={STYLE_OPTIONS} value={styleFilter} onChange={onStyleChange} />
      <FilterGroup options={TYPE_OPTIONS} value={typeFilter} onChange={onTypeChange} />
    </div>
  )
}
