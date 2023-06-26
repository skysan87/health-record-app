import { HealthType } from "../ValueObject"

export class Health {
  constructor(
    public id: string, // randam
    public year: number,
    public month: number,
    public date: number,
    public type?: HealthType,
    public value?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) { }
}