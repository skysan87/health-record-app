import type { Health } from "@health-record/core/model"
import type { IHealthRepository } from "@health-record/core/repository"
import type { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class DebugHealthRepository implements IHealthRepository {

  private static readonly KEY: string = 'HEALTH'

  private getData(scope: Scope): Health[] {
    const data: Health[] = scope.get(DebugHealthRepository.KEY) ?? []
    return data.map((d: Health) => {
      return {
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      }
    })
  }

  get(scope: Scope): Promise<Health[]> {
    return Promise.resolve(this.getData(scope))
  }

  save(scope: Scope, params: Health): Promise<void> {
    return new Promise(resolve => {
      const timestamp = new Date()
      params.id = Date.now().toString()
      params.createdAt = timestamp
      params.updatedAt = timestamp

      const lists = this.getData(scope)
      lists.push(params)
      scope.save(DebugHealthRepository.KEY, lists)

      resolve()
    })
  }

}