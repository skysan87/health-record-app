import { Record, Nominal, DateNumber } from "../ValueObject"

export type Activity = Nominal<{
  id: DateNumber
  total: number
  records: Record[]
  createdAt: Date
  updatedAt: Date
}, 'Activity'>