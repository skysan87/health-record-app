import { HealthType, HealthGoalType, GoalWeightRange } from "../ValueObject"

export class Healthlist {
  constructor(
    public id: string,
    public BMI: number = 0,
    public isOutOfLineBMI: boolean = false,
    public latest: {
      [HealthType.HEIGHT]?: number,
      [HealthType.WEIGHT]?: number
    } = {},
    public goal: {
      [HealthGoalType.ACTIVITY]?: number,
      [HealthGoalType.WEIGHT]?: number
    } = {},
    public goalWeightRange?: GoalWeightRange,
    public createdAt?: Date,
    public updatedAt?: Date
  ) { }
}