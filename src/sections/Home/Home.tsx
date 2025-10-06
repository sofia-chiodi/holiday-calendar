import { useFetchHolidays } from '../../queries/useFetchHolidays'

import { HolidayCard } from '../../components/HolidayCard/HolidayCard'

export const Home = () => {
  const { data, isLoading, error } = useFetchHolidays()

  if (isLoading)
    return (
      <div className='text-center text-teal-400 animate-pulse'>
        Cargando feriados… 📅
      </div>
    )

  if (error) return <div>Error: {error.message}</div>

  const today = new Date()

  const nextHoliday = data?.find((holiday) => {
    return new Date(holiday.date) > today
  })

  const daysUntilNextHoliday = Math.floor(
    (new Date(nextHoliday?.date || '') - today) / (1000 * 60 * 60 * 24)
  )

  return (
    <section
      id='home'
      className='bg-gradient-to-r from-teal-100/70 to-orange-100/70'
    >
      <div className='py-32 px-12'>
        <div className='relative z-10 max-w-5xl mx-auto'>
          <div className='max-w-2xl mx-auto mb-16 bg-gradient-to-r from-teal-200/80 to-orange-200/80 rounded-full p-6 text-center'>
            <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-orange-500'>
              ✨ Feriados en Argentina 2025 ✨
            </h1>
          </div>

          <h3 className='text-xl text-center text-teal-400 animate-pulse mb-12'>
            Faltan{' '}
            <span className='font-bold text-orange-400'>
              {daysUntilNextHoliday}
            </span>{' '}
            dias para el próximo feriado 🗓️
          </h3>

          <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-4 items-start'>
            {data?.map((holiday, holidayId) => (
              <HolidayCard key={holidayId} holiday={holiday} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
