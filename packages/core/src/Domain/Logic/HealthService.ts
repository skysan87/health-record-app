import { Healthlist } from "../Model/Healthlist"
import { HealthType, HealthGoalType, GoalWeightRange } from "../ValueObject"

export class HealthService {

  constructor(private _healthlist: Healthlist) { }

  public calcBMI(): void {
    const weight = this._healthlist.latest[HealthType.WEIGHT] // kg
    const height = this._healthlist.latest[HealthType.HEIGHT] // cm
    if (!weight || !height) {
      this._healthlist.BMI = 0
    } else {
      this._healthlist.BMI = weight / Math.pow(height / 100, 2)
    }
    this._healthlist.isOutOfLineBMI = this._healthlist.BMI <= 18.5 || this._healthlist.BMI >= 25.0
  }

  public data(): Healthlist {
    const value = new Healthlist(
      this._healthlist.id ?? '',
      this._healthlist.BMI ?? 0,
      this._healthlist.isOutOfLineBMI,
      {
        [HealthType.HEIGHT]: this._healthlist.latest[HealthType.HEIGHT] ?? 0,
        [HealthType.WEIGHT]: this._healthlist.latest[HealthType.WEIGHT] ?? 0,
      },
      {
        [HealthGoalType.ACTIVITY]: this._healthlist.goal[HealthGoalType.ACTIVITY] ?? 0,
        [HealthGoalType.WEIGHT]: this._healthlist.goal[HealthGoalType.WEIGHT] ?? 0,
      },
      this._healthlist.goalWeightRange ?? new GoalWeightRange(0, 0, null, null),
      this._healthlist.createdAt,
      this._healthlist.updatedAt
    )
    return value
  }
}