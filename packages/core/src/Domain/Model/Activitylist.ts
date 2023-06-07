import { Menu } from "@/Domain/ValueObject"

export class Activitylist {
  constructor(
    public id: string, // userId
    public menu: Menu[] = [],
    public createdAt?: Date,
    public updatedAt?: Date
  ) { }
}