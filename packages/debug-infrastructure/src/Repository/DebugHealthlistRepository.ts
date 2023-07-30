import { Healthlist } from "@health-record/core/model";
import { IHealthlistRepository } from "@health-record/core/repository";
import { HealthGoalType, HealthType, UserId } from "@health-record/core/value-object";

export class DebugHealthlistRepository implements IHealthlistRepository {

  private memory: Map<string, Healthlist> = new Map<string, Healthlist>()

  get(userId: UserId): Promise<Healthlist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId.value) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId): Promise<Healthlist> {
    return new Promise(resolve => {
      const data = new Healthlist(userId.value)
      data.latest = {
        [HealthType.HEIGHT]: 0,
        [HealthType.WEIGHT]: 0
      }
      data.goal = {
        [HealthGoalType.ACTIVITY]: 0,
        [HealthGoalType.WEIGHT]: 0
      }
      this.memory.set(userId.value, data)
      resolve(data)
    })
  }

  update(params: {}, userId: UserId): Promise<Healthlist> {
    return new Promise(resolve => {
      const data = this.memory.get(userId.value) ?? {} as Healthlist
      const clone = {
        ...data,
        ...params // 更新された値
      } as Healthlist
      resolve(clone)
    })
  }

}