import type { Holiday } from '../../types/holiday'

interface HolidayCardType {
  holiday: Holiday
}

export const HolidayCard = ({ holiday }: HolidayCardType) => {
  return (
    <div className='bg-gradient-to-r from-orange-200/80 to-teal-200/80 rounded-2xl shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 flex flex-col justify-between h-50'>
      <div className='flex flex-col items-center justify-center flex-1'>
        <h2 className='text-center text-lg font-semibold text-orange-400'>
          {holiday.localName}
        </h2>
        <p className='text-center text-teal-500 font-semibold mt-2'>
          {holiday.date}
        </p>
      </div>
    </div>
  )
}
