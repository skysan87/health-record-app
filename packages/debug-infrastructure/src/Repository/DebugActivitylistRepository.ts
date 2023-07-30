import { Activitylist } from "@health-record/core/model"
import { UserId } from "@health-record/core/value-object"
import { IActivitylistRepository } from "@health-record/core/repository"

export class DebugActivitylistRepository implements IActivitylistRepository {

  private memory: Map<string, Activitylist> = new Map<string, Activitylist>()

  get(userId: UserId): Promise<Activitylist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId.value) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId): Promise<Activitylist> {
    return new Promise(resolve => {
      const data = new Activitylist(userId.value)
      this.memory.set(userId.value, data)
      resolve(data)
    })
  }

  update(params: {}, userId: UserId): Promise<Activitylist> {
    return new Promise(resolve => {
      const data = this.memory.get(userId.value) ?? {} as Activitylist
      const clone = {
        ...data,
        ...params // 更新された値
      } as Activitylist
      resolve(clone)
    })
  }
}