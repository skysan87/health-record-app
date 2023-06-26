import { Health } from "@health-record/core/model";
import { IHealthRepository } from "@health-record/core/repository";
import { UserId } from "@health-record/core/value-object";

export class DebugHealthRepository implements IHealthRepository {

  private memory: Array<Health> = new Array<Health>()

  get(userId: UserId): Promise<Health[]> {
    return new Promise(resolve => {
      resolve(this.memory)
    })
  }

  save(params: Health, userId: UserId): Promise<Health> {
    return new Promise(resolve => {
      params.id = Date.now().toString()
      resolve(params)
    })
  }

}