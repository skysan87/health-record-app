import type { Healthlist } from "@health-record/core/model";
import { IHealthlistRepository } from "@health-record/core/repository";
import { HealthGoalType, HealthType, UserId } from "@health-record/core/value-object";

export class DebugHealthlistRepository implements IHealthlistRepository {

  private memory: Map<UserId, Healthlist> = new Map<UserId, Healthlist>()

  get(userId: UserId): Promise<Healthlist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId): Promise<Healthlist> {
    return new Promise(resolve => {
      const data = { id: userId } as Healthlist
      data.latest = {
        [HealthType.HEIGHT]: 0,
        [HealthType.WEIGHT]: 0
      }
      data.goal = {
        [HealthGoalType.ACTIVITY]: 0,
        [HealthGoalType.WEIGHT]: 0
      }
      this.memory.set(userId, data)
      resolve(data)
    })
  }

  update(params: {}, userId: UserId): Promise<Healthlist> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? {} as Healthlist
      const clone = {
        ...data,
        ...params // 更新された値
      } as Healthlist
      this.memory.set(userId, clone)
      resolve(clone)
    })
  }

}