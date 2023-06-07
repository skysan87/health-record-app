import { Healthlist } from "@health-record/core/model";
import { IHealthlistRepository } from "@health-record/core/repository";
import { UserId } from "@health-record/core/value-object";

export class DebugHealthlistRepository implements IHealthlistRepository {

  private memory: Map<UserId, Healthlist> = new Map<UserId, Healthlist>()

  get(userId: UserId): Promise<Healthlist | null> {
    return new Promise(resolve => {
      const data = this.memory.get(userId) ?? null
      resolve(data)
    })
  }

  save(userId: UserId): Promise<Healthlist> {
    return new Promise(resolve => {
      const data = new Healthlist(userId.value)
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
      resolve(clone)
    })
  }

}