import { Nominal, HealthType, HealthGoalType, GoalWeightRange, UserId } from "../ValueObject"

export type Healthlist = Nominal<{
  id: UserId
  BMI: number
  isOutOfLineBMI: boolean
  latest: {
    [HealthType.HEIGHT]: number
    [HealthType.WEIGHT]: number
  }
  goal: {
    [HealthGoalType.ACTIVITY]: number
    [HealthGoalType.WEIGHT]: number
  }
  goalWeightRange: GoalWeightRange
  createdAt: Date
  updatedAt: Date
}, 'Healthlist'>