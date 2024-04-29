import type { Activitylist } from "../Model"
import type { IBehavior } from "./IBehavior"

export class ActivitylistBehavior implements IBehavior<Activitylist> {

  constructor(private _activitylist: Activitylist) { }

  public get<K extends keyof Activitylist>(key: K) {
    return this._activitylist[key]
  }

  public action(callback: (behavior: ActivitylistBehavior) => void): Activitylist {
    this._activitylist = this.format()
    callback(this)
    return this._activitylist
  }

  public async actionAsync(callback: (behavior: ActivitylistBehavior) => Promise<void>): Promise<Activitylist> {
    this._activitylist = this.format()
    await callback(this)
    return this._activitylist
  }

  public update(input: Partial<Activitylist>): void {
    this._activitylist = {
      ...this._activitylist,
      ...input
    }
  }

  public format(): Activitylist {
    const input = this._activitylist
    return {
      id: input.id ?? '',
      menu: input.menu ?? [],
      createdAt: input.createdAt ?? null,
      updatedAt: input.updatedAt ?? null
    } as Activitylist
  }
}