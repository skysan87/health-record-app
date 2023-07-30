import { Healthlist } from "../Model/Healthlist"
import { HealthType } from "../ValueObject"

export class HealthService {

  constructor(private _healthlist: Healthlist) { }

  public updateLatest(type: HealthType, value: number): void {
    this._healthlist.latest[type] = value
    this.calcBMI()
  }

  private calcBMI(): void {
    const weight = this._healthlist.latest[HealthType.WEIGHT] // kg
    const height = this._healthlist.latest[HealthType.HEIGHT] // cm
    if (!weight || !height) {
      this._healthlist.BMI = 0
    } else {
      this._healthlist.BMI = weight / Math.pow(height / 100, 2)
    }
    this._healthlist.isOutOfLineBMI = this._healthlist.BMI <= 18.5 || this._healthlist.BMI >= 25.0
  }
}