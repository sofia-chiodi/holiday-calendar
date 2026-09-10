import { formatLongDate, MONTHS_SHORT, parseHolidayDate } from '../../lib/dates'
import { holidayIcon, typeLabel } from '../../lib/holidayMeta'
import type { Holiday } from '../../types/holiday'

interface HolidayCardProps {
  id: string
  holiday: Holiday
  daysUntil: number
  isNext: boolean
  isExpanded: boolean
  onToggle: () => void
}

function statusCopy(daysUntil: number) {
  if (daysUntil === 0) return 'Hoy'
  if (daysUntil === 1) return 'Mañana'
  if (daysUntil > 1) return `En ${daysUntil} días`
  if (daysUntil === -1) return 'Ayer'
  return `Hace ${Math.abs(daysUntil)} días`
}

export const HolidayCard = ({
  id,
  holiday,
  daysUntil,
  isNext,
  isExpanded,
  onToggle,
}: HolidayCardProps) => {
  const date = parseHolidayDate(holiday.date)
  const isPast = daysUntil < 0
  const isToday = daysUntil === 0
  const types = holiday.types ?? []

  return (
    <article
      id={id}
      className={`holiday-card ${isPast ? 'is-past' : ''} ${isToday ? 'is-today' : ''} ${isNext ? 'is-next' : ''}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="holiday-card-button"
      >
        <div className="flex items-center justify-between gap-2">
          <div className={`date-stamp ${isPast ? '' : 'date-stamp-live'}`}>
            <span className="font-display text-2xl leading-none">
              {date.getDate()}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              {MONTHS_SHORT[date.getMonth()]}
            </span>
          </div>
          <span className="text-xl" aria-hidden>
            {holidayIcon(holiday)}
          </span>
        </div>

        <h3
          className="holiday-title"
          title={holiday.localName}
        >
          {holiday.localName}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span
            className={`status-badge ${isToday ? 'status-today' : ''} ${isNext ? 'status-next' : ''}`}
          >
            {isNext && !isToday ? 'El próximo · ' : ''}
            {statusCopy(daysUntil)}
          </span>
          <span className={`chevron ${isExpanded ? 'is-open' : ''}`} aria-hidden>
            ⌄
          </span>
        </div>
      </button>

      <div
        className={`card-details ${isExpanded ? 'is-open' : ''}`}
        aria-hidden={!isExpanded}
      >
        <p className="text-sm text-ink-soft">{formatLongDate(holiday.date)}</p>
        {holiday.name !== holiday.localName && (
          <p className="mt-2 text-sm text-ink">{holiday.name}</p>
        )}
        {types.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {types.map((type) => (
              <span key={type} className="type-chip">
                {typeLabel(type)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
