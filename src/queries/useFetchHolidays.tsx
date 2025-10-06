import { useQuery } from '@tanstack/react-query'
import { getHolidays } from '../services/getHolidays'
import type { Holiday } from '../types/holiday'

export const useFetchHolidays = () => {
  const { data, isLoading, error } = useQuery<Holiday[], Error>({
    queryKey: ['holidays'],
    queryFn: getHolidays,
  })

  return { data, isLoading, error }
}
