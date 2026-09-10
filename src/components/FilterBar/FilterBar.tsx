import { MONTHS_SHORT } from '../../lib/dates'

export type HolidayFilter = 'all' | 'upcoming' | 'past' | 'month'

const FILTERS: Array<{ id: HolidayFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'upcoming', label: 'Próximos' },
  { id: 'past', label: 'Pasados' },
  { id: 'month', label: 'Este mes' },
]

interface FilterBarProps {
  query: string
  onQueryChange: (value: string) => void
  filter: HolidayFilter
  onFilterChange: (value: HolidayFilter) => void
  visibleMonths: Set<number>
  currentMonth: number
  onJumpToMonth: (month: number) => void
  resultCount: number
}

export const FilterBar = ({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  visibleMonths,
  currentMonth,
  onJumpToMonth,
  resultCount,
}: FilterBarProps) => {
  return (
    <div className="filter-bar">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <label className="search-field lg:max-w-sm lg:flex-1">
          <span className="sr-only">Buscar feriado</span>
          <span aria-hidden className="text-ink-soft">
            ⌕
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por nombre…"
            className="search-input"
          />
        </label>

        <div
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
          role="radiogroup"
          aria-label="Filtrar feriados"
        >
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={filter === item.id}
              onClick={() => onFilterChange(item.id)}
              className={`chip ${filter === item.id ? 'chip-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" aria-label="Ir a un mes">
          {MONTHS_SHORT.map((label, month) => {
            const enabled = visibleMonths.has(month)
            return (
              <button
                key={label}
                type="button"
                disabled={!enabled}
                onClick={() => onJumpToMonth(month)}
                className={`month-pill ${month === currentMonth ? 'month-pill-now' : ''}`}
              >
                {label}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-ink-soft">
          {resultCount} {resultCount === 1 ? 'feriado' : 'feriados'}
        </p>
      </div>
    </div>
  )
}
