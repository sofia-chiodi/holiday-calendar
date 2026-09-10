import { useEffect, useState } from 'react'
import { daysUntil, formatLongDate, parseHolidayDate } from '../../lib/dates'
import { holidayIcon } from '../../lib/holidayMeta'
import type { Holiday } from '../../types/holiday'

interface CountdownHeroProps {
  holiday?: Holiday
  year: number
  pastCount: number
  totalCount: number
  onSeeHoliday: () => void
}

function splitDuration(target: Date, now: Date) {
  const remaining = Math.max(0, target.getTime() - now.getTime())
  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export const CountdownHero = ({
  holiday,
  year,
  pastCount,
  totalCount,
  onSeeHoliday,
}: CountdownHeroProps) => {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const progress =
    totalCount === 0 ? 0 : Math.round((pastCount / totalCount) * 100)

  if (!holiday) {
    return (
      <section className='hero-panel'>
        <p className='hero-kicker'>Calendario {year}</p>
        <h2 className='font-display text-4xl sm:text-5xl text-paper leading-tight'>
          Se terminaron los feriados de este año
        </h2>
        <p className='mt-4 text-paper/75 max-w-xl'>
          Disfrutá el tramo final del calendario. El próximo calendario llega en
          enero.
        </p>
      </section>
    )
  }

  const until = daysUntil(holiday.date, now)
  const isToday = until === 0
  const countdown = splitDuration(parseHolidayDate(holiday.date), now)
  const units = [
    { label: 'días', value: countdown.days },
    { label: 'horas', value: countdown.hours },
    { label: 'min', value: countdown.minutes },
    { label: 'seg', value: countdown.seconds },
  ]

  return (
    <section className='hero-panel'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <p className='hero-kicker'>
          {isToday ? 'Hoy es feriado' : 'Próximo feriado'}
        </p>
        <p className='text-xs uppercase tracking-[0.22em] text-sun/90'>
          {pastCount} de {totalCount} ya pasaron
        </p>
      </div>

      <div className='mt-6 flex items-start gap-4'>
        <span
          className='text-5xl sm:text-6xl leading-none drop-shadow-sm'
          aria-hidden
        >
          {holidayIcon(holiday)}
        </span>
        <div className='min-w-0'>
          <h2 className='font-display text-4xl sm:text-5xl text-paper leading-[1.05] text-balance'>
            {holiday.localName}
          </h2>
          <p className='mt-3 text-paper/75 text-lg'>
            {formatLongDate(holiday.date)}
          </p>
        </div>
      </div>

      {isToday ? (
        <p className='mt-8 font-display text-3xl text-sun'>
          Un día para no hacer nada urgente.
        </p>
      ) : (
        <div
          className='mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3'
          aria-live='polite'
        >
          {units.map((unit) => (
            <div key={unit.label} className='countdown-cell'>
              <span className='font-display text-3xl sm:text-5xl tabular-nums text-paper'>
                {unit.label === 'días' ? unit.value : pad(unit.value)}
              </span>
              <span className='mt-1 text-[11px] uppercase tracking-[0.18em] text-paper/55'>
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className='mt-8 flex flex-col gap-5'>
        <button
          type='button'
          className='hero-link self-start'
          onClick={onSeeHoliday}
        >
          Ver en el calendario
          <span aria-hidden>↓</span>
        </button>
        <div
          className='year-track'
          aria-label={`Progreso del año: ${progress}%`}
        >
          <span className='year-track-fill' style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  )
}
