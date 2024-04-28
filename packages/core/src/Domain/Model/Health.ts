import type { HealthType, Nominal } from "../ValueObject"

export type Health = Nominal<{
  /** random */
  id: string
  year: number
  month: number
  date: number
  type: HealthType
  value: number
  createdAt: Date
  updatedAt: Date
}, 'Health'>