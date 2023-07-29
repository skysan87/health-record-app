import { HealthType, HealthGoalType } from "../ValueObject"

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
    public createdAt?: Date,
    public updatedAt?: Date
  ) { }

  public updateLatest(type: HealthType, value: number): void {
    this.latest[type] = value
    this.calcBMI()
  }

  private calcBMI(): void {
    const weight = this.latest[HealthType.WEIGHT] // kg
    const height = this.latest[HealthType.HEIGHT] // cm
    if (!weight || !height) {
      this.BMI = 0
    } else {
      this.BMI = weight / Math.pow(height / 100, 2)
    }
    this.isOutOfLineBMI = this.BMI <= 18.5 || this.BMI >= 25.0
  }
}