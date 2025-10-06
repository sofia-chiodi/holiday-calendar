import axios from 'axios'
import type { Holiday } from '../types/holiday'

export const getHolidays = async (): Promise<Holiday[]> => {
  const res = await axios.get<Holiday[]>(
    'https://date.nager.at/api/v3/publicholidays/2025/AR'
  )
  return res.data
}
