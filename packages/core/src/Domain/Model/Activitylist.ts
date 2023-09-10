import { Menu, Nominal } from "../ValueObject"

export type Activitylist = Nominal<{
  id: string // userId
  menu: Menu[]
  createdAt: Date
  updatedAt: Date
}, 'Activitylist'>