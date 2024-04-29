import { type Activity } from "../Model"
import type { Record } from "../ValueObject"
import type { IBehavior } from "./IBehavior"

export class ActivityBehavior implements IBehavior<Activity> {

  constructor(private _activity: Activity) { }

  public action(callback: (behavior: ActivityBehavior) => void): Activity {
    this._activity = this.format()
    callback(this)
    this.calcTotal()
    return this._activity
  }

  public async actionAsync(callback: (behavior: ActivityBehavior) => Promise<void>): Promise<Activity> {
    this._activity = this.format()
    await callback(this)
    this.calcTotal()
    return this._activity
  }

  public update(input: Partial<Activity>): void {
    this._activity = {
      ...this._activity,
      ...input
    }
  }

  public get<K extends keyof Activity>(key: K) {
    return this._activity[key]
  }

  public addRecord(record: Record): void {
    this._activity.records.push(record)
    this.calcTotal()
  }

  private calcTotal(): void {
    const tmp = this._activity.records.reduce((sum, item) => sum + (item.value ?? 0), 0)
    this._activity.total = parseFloat(tmp.toFixed(2))
  }

  public format(): Activity {
    const input = this._activity
    return {
      id: input.id ?? '',
      total: input.total ?? 0,
      records: input.records ?? [],
      createdAt: input.createdAt ?? null,
      updatedAt: input.updatedAt ?? null,
    } as Activity
  }
}