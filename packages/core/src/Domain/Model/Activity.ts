import { Record } from "../ValueObject"

export class Activity {
  constructor(
    public id: string,
    public total: number = 0,
    public records: Record[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) { }
}