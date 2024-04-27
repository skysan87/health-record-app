import type { GoalWeightRange, HealthGoalType, HealthType } from "@health-record/core/value-object"
import type { FieldValue } from 'firebase/firestore'

export type HealthlistEntity = {
  latest?: {
    [HealthType.HEIGHT]: number
    [HealthType.WEIGHT]: number
  }
  goal?: {
    [HealthGoalType.ACTIVITY]: number
    [HealthGoalType.WEIGHT]: number
  }
  goalWeightRange?: GoalWeightRange
  createdAt?: FieldValue
  updatedAt?: FieldValue
}
