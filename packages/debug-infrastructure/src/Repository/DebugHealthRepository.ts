import type { Health } from "@health-record/core/model"
import type { IHealthRepository, ITransactionScope as Scope } from "@health-record/core/repository"

export class DebugHealthRepository implements IHealthRepository {

  private static readonly KEY: string = 'HEALTH'

  public async get(scope: Scope): Promise<Health[]> {
    const data = (await scope.get(DebugHealthRepository.KEY))
      .map((d: Health) => {
        return {
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt)
        }
      }) as Health[]
      return data
  }

  public async save(scope: Scope, params: Health): Promise<void> {
    const timestamp = new Date()
    params.id = Date.now().toString()
    params.createdAt = timestamp
    params.updatedAt = timestamp

    await scope.create(DebugHealthRepository.KEY, params)
  }

}