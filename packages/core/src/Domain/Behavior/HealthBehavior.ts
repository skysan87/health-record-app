import type { Health } from "../Model"
import type { IBehavior } from "./IBehavior"

export class HealthBehavior implements IBehavior<Health> {

  constructor(private _health: Health) { }

  update(input: Health): void {
    throw new Error("Method not implemented.")
  }

  action(callback: (behavior: IBehavior<Health>) => void): Health {
    throw new Error("Method not implemented.")
  }

  actionAsync(callback: (behavior: IBehavior<Health>) => Promise<void>): Promise<Health> {
    throw new Error("Method not implemented.")
  }

  public get<K extends keyof Health>(key: K) {
    return this._health[key]
  }

  public format(): Health {
    const input = this._health
    return {
      id: input.id ?? '',
      year: input.year ?? null,
      month: input.month ?? null,
      date: input.date ?? null,
      type: input.type ?? null,
      value: input.value ?? null,
      createdAt: input.createdAt ?? null,
      updatedAt: input.updatedAt ?? null
    } as Health
  }
}