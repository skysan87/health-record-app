import { Activity } from "../Model/Activity"
import { Record } from "../ValueObject"

export class ActivityService {

  constructor(private _activity: Activity) { }

  public addRecord(record: Record): void {
    this._activity.records.push(record)
    this.calcTotal()
  }

  private calcTotal(): void {
    const tmp = this._activity.records.reduce((sum, item) => sum + (item.value ?? 0), 0)
    this._activity.total = parseFloat(tmp.toFixed(2))
  }
}