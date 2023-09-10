import type { Healthlist } from "../Model/Healthlist"
import { HealthType, HealthGoalType, GoalWeightRange } from "../ValueObject"
import { IBehavior } from "./IBehavior"

export class HealthlistBehavior implements IBehavior<Healthlist> {

  constructor(private _healthlist: Healthlist) { }

  public get<K extends keyof Healthlist>(key: K) {
    return this._healthlist[key]
  }

  public action(callback: (behavior: HealthlistBehavior) => void): Healthlist {
    this._healthlist = this.format()
    callback(this)
    this.calcBMI(this._healthlist)
    return this._healthlist
  }

  public async actionAsync(callback: (behavior: HealthlistBehavior) => Promise<void>): Promise<Healthlist> {
    this._healthlist = this.format()
    await callback(this)
    this.calcBMI(this._healthlist)
    return this._healthlist
  }

  public update(input: Healthlist): void {
    this._healthlist = {
      ...this._healthlist,
      ...input
    }
  }

  public format(): Healthlist {
    const input = this._healthlist
    return {
      id: input.id ?? '',
      BMI: input.BMI ?? 0,
      isOutOfLineBMI: input.isOutOfLineBMI ?? false,
      latest: {
        [HealthType.HEIGHT]: input.latest?.[HealthType.HEIGHT] ?? 0,
        [HealthType.WEIGHT]: input.latest?.[HealthType.WEIGHT] ?? 0,
      },
      goal: {
        [HealthGoalType.ACTIVITY]: input.goal?.[HealthGoalType.ACTIVITY] ?? 0,
        [HealthGoalType.WEIGHT]: input.goal?.[HealthGoalType.WEIGHT] ?? 0,
      },
      goalWeightRange: input.goalWeightRange ?? new GoalWeightRange(0, 0, null, null),
      createdAt: input.createdAt ?? null,
      updatedAt: input.updatedAt ?? null
    } as Healthlist
  }

  public validateGoalWeightRange() {
    return !!this._healthlist.goal?.[HealthGoalType.WEIGHT]
      && !!this._healthlist.latest?.[HealthType.WEIGHT]
  }

  public setGoalWeightRange(startDate: Date, endDate: Date) {
    this._healthlist.goalWeightRange = new GoalWeightRange(
      this._healthlist.latest?.[HealthType.WEIGHT] ?? 0,
      this._healthlist.goal?.[HealthGoalType.WEIGHT] ?? 0,
      startDate,
      endDate
    )
  }

  private calcBMI(input: Healthlist): void {
    const weight = input.latest?.[HealthType.WEIGHT] ?? 0// kg
    const height = input.latest?.[HealthType.HEIGHT] ?? 0// cm
    if (!weight || !height) {
      input.BMI = 0
    } else {
      input.BMI = weight / Math.pow(height / 100, 2)
    }
    input.isOutOfLineBMI = input.BMI <= 18.5 || input.BMI >= 25.0
  }
}