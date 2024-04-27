import type { Activitylist } from "@health-record/core/model"
import type { UserId } from "@health-record/core/value-object"
import type { IActivitylistRepository } from "@health-record/core/repository"

export class DebugActivitylistRepository implements IActivitylistRepository {

  private memory: Map<UserId, Activitylist> = new Map<UserId, Activitylist>()

  get(userId: UserId): Promise<Activitylist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId, data: Partial<Activitylist>): Promise<void> {
    return new Promise(resolve => {
      const data = { id: userId } as Activitylist
      this.memory.set(userId, data)
      resolve()
    })
  }

  update(params: {}, userId: UserId): Promise<void> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? {} as Activitylist
      const clone = {
        ...data,
        ...params // 更新された値
      } as Activitylist
      this.memory.set(userId, clone)
      resolve()
    })
  }
}