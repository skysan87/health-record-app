import { HealthType, HealthGoalType } from "@/Domain/ValueObject"

export class Healthlist {
  constructor(
    public id: string,
    public latest: {
      [HealthType.HEIGHT]?: number,
      [HealthType.WEIGHT]?: number
    },
    public goal: {
      [HealthGoalType.ACTIVITY]?: number,
      [HealthGoalType.WEIGHT]?: number
    },
    public createdAt?: Date,
    public updatedAt?: Date
  ) { }
}