import type { Healthlist } from "@health-record/core/model"
import type { IHealthlistRepository } from "@health-record/core/repository"
import type { UserId } from "@health-record/core/value-object"

export class DebugHealthlistRepository implements IHealthlistRepository {

  private memory: Map<UserId, Healthlist> = new Map<UserId, Healthlist>()

  get(userId: UserId): Promise<Healthlist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId, data: Partial<Healthlist>): Promise<void> {
    return new Promise(resolve => {
      const newData = { ...data, id: userId } as Healthlist
      this.memory.set(userId, newData)
      resolve()
    })
  }

  update(params: Partial<Healthlist>, userId: UserId): Promise<void> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? {} as Healthlist
      const clone = {
        ...data,
        ...params // 更新された値
      } as Healthlist
      this.memory.set(userId, clone)
      resolve()
    })
  }

}