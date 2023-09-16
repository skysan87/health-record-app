import { Health } from "@health-record/core/model";
import { IHealthRepository } from "@health-record/core/repository";
import { UserId } from "@health-record/core/value-object";

export class DebugHealthRepository implements IHealthRepository {

  private memory: Array<Health> = new Array<Health>()

  get(userId: UserId): Promise<Health[]> {
    return new Promise(resolve => {
      resolve(structuredClone(this.memory))
    })
  }

  save(params: Health, userId: UserId): Promise<void> {
    return new Promise(resolve => {
      const timestamp = new Date()
      params.id = Date.now().toString()
      params.createdAt = timestamp
      params.updatedAt = timestamp
      this.memory.push(params)
      resolve()
    })
  }

}