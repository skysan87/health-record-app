import { Record, Nominal } from "../ValueObject"

export type Activity = Nominal<{
  id: string
  total: number
  records: Record[]
  createdAt: Date
  updatedAt: Date
}, 'Activity'>