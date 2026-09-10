import { useEffect, useMemo, useRef, useState } from 'react'
import { HolidayCard } from '../../components/HolidayCard/HolidayCard'
import { CountdownHero } from '../../components/CountdownHero/CountdownHero'
import {
  FilterBar,
  type HolidayFilter,
} from '../../components/FilterBar/FilterBar'
import {
  daysUntil,
  formatMonthYear,
  normalizeSearch,
  parseHolidayDate,
} from '../../lib/dates'
import { holidayKey } from '../../lib/holidayMeta'
import { useFetchHolidays } from '../../queries/useFetchHolidays'
import type { Holiday } from '../../types/holiday'

const year = new Date().getFullYear()

function cardId(holiday: Holiday) {
  const slug = normalizeSearch(holiday.localName).replace(/[^a-z0-9]+/g, '-')
  return `feriado-${holiday.date}-${slug}`
}

export const Home = () => {
  const { data, isLoading, error, refetch, isFetching } = useFetchHolidays()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<HolidayFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [today] = useState(() => new Date())
  const pendingScrollId = useRef<string | null>(null)

  const currentMonth = today.getMonth()

  const holidays = useMemo(() => data ?? [], [data])
  const nextHoliday = holidays.find(
    (holiday) => daysUntil(holiday.date, today) >= 0,
  )
  const pastCount = holidays.filter(
    (holiday) => daysUntil(holiday.date, today) < 0,
  ).length

  const visibleHolidays = useMemo(() => {
    const needle = normalizeSearch(query)

    return holidays.filter((holiday) => {
      const until = daysUntil(holiday.date, today)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'upcoming' && until >= 0) ||
        (filter === 'past' && until < 0) ||
        (filter === 'month' &&
          parseHolidayDate(holiday.date).getMonth() === currentMonth)

      if (!matchesFilter) return false
      if (!needle) return true

      return (
        normalizeSearch(holiday.localName).includes(needle) ||
        normalizeSearch(holiday.name).includes(needle)
      )
    })
  }, [currentMonth, filter, holidays, query, today])

  const grouped = useMemo(() => {
    const groups = new Map<number, Holiday[]>()

    for (const holiday of visibleHolidays) {
      const month = parseHolidayDate(holiday.date).getMonth()
      const list = groups.get(month) ?? []
      list.push(holiday)
      groups.set(month, list)
    }

    return [...groups.entries()]
  }, [visibleHolidays])

  const visibleMonths = useMemo(
    () => new Set(grouped.map(([month]) => month)),
    [grouped],
  )

  const jumpToMonth = (month: number) => {
    document.getElementById(`mes-${month}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  useEffect(() => {
    if (!pendingScrollId.current) return
    const node = document.getElementById(pendingScrollId.current)
    if (!node) return
    node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    pendingScrollId.current = null
  }, [visibleHolidays, expandedId])

  const seeNextHoliday = () => {
    if (!nextHoliday) return
    pendingScrollId.current = cardId(nextHoliday)
    setFilter('all')
    setQuery('')
    setExpandedId(holidayKey(nextHoliday))
  }

  return (
    <div className='app-shell'>
      <div className='atmosphere' aria-hidden>
        <span className='orb orb-a' />
        <span className='orb orb-b' />
        <span className='orb orb-c' />
        <span className='grain' />
      </div>

      <header className='relative z-10 mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-5 pt-10 sm:px-8'>
        <div>
          <p className='text-[11px] uppercase tracking-[0.28em] text-clay'>
            Argentina
          </p>
          <h1 className='font-display mt-2 text-4xl sm:text-6xl text-ink'>
            Feriados {year}
          </h1>
        </div>
        <p className='hidden max-w-xs text-right text-sm leading-relaxed text-ink-soft sm:block'>
          Un calendario de los días en los que el país se toma un respiro.
        </p>
      </header>

      <main className='relative z-10 mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8'>
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState
            message={error.message}
            onRetry={() => {
              void refetch()
            }}
            busy={isFetching}
          />
        ) : (
          <>
            <CountdownHero
              holiday={nextHoliday}
              year={year}
              pastCount={pastCount}
              totalCount={holidays.length}
              onSeeHoliday={seeNextHoliday}
            />

            <FilterBar
              query={query}
              onQueryChange={setQuery}
              filter={filter}
              onFilterChange={setFilter}
              visibleMonths={visibleMonths}
              currentMonth={currentMonth}
              onJumpToMonth={jumpToMonth}
              resultCount={visibleHolidays.length}
            />

            {grouped.length === 0 ? (
              <p className='mt-16 text-center font-display text-2xl text-ink-soft'>
                No hay feriados que coincidan con esa búsqueda.
              </p>
            ) : (
              <div className='mt-8 space-y-8'>
                {grouped.map(([month, monthHolidays], groupIndex) => (
                  <section
                    key={month}
                    id={`mes-${month}`}
                    className='scroll-mt-28'
                  >
                    <h2 className='font-display text-2xl text-pine'>
                      {formatMonthYear(month, year)}
                    </h2>
                    <div className='mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                      {monthHolidays.map((holiday, index) => {
                        const id = holidayKey(holiday)
                        const until = daysUntil(holiday.date, today)
                        return (
                          <div
                            key={id}
                            className='card-enter h-full'
                            style={{
                              animationDelay: `${(groupIndex * 3 + index) * 45}ms`,
                            }}
                          >
                            <HolidayCard
                              id={cardId(holiday)}
                              holiday={holiday}
                              daysUntil={until}
                              isNext={
                                nextHoliday
                                  ? holidayKey(nextHoliday) === id
                                  : false
                              }
                              isExpanded={expandedId === id}
                              onToggle={() =>
                                setExpandedId((current) =>
                                  current === id ? null : id,
                                )
                              }
                            />
                          </div>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

const LoadingState = () => (
  <div className='space-y-8' aria-busy='true' aria-live='polite'>
    <div className='hero-panel animate-pulse'>
      <div className='h-3 w-32 rounded-full bg-paper/20' />
      <div className='mt-6 h-12 w-3/4 rounded-full bg-paper/20' />
      <div className='mt-8 grid grid-cols-4 gap-3'>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className='h-24 rounded-2xl bg-paper/15' />
        ))}
      </div>
    </div>
    <p className='text-center text-pine-mist'>Cargando el calendario…</p>
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className='h-36 rounded-[1.15rem] bg-white/50 animate-pulse'
        />
      ))}
    </div>
  </div>
)

const ErrorState = ({
  message,
  onRetry,
  busy,
}: {
  message: string
  onRetry: () => void
  busy: boolean
}) => (
  <div className='hero-panel text-center'>
    <p className='hero-kicker'>Algo salió mal</p>
    <h2 className='font-display mt-4 text-4xl text-paper'>
      No pudimos cargar los feriados
    </h2>
    <p className='mx-auto mt-3 max-w-md text-paper/70'>{message}</p>
    <button type='button' className='hero-link mx-auto mt-8' onClick={onRetry}>
      {busy ? 'Reintentando…' : 'Reintentar'}
    </button>
  </div>
)
