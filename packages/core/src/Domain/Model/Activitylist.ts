import type { Menu, Nominal, UserId } from "../ValueObject"

export type Activitylist = Nominal<{
  id: UserId
  menu: Menu[]
  createdAt: Date
  updatedAt: Date
}, 'Activitylist'>