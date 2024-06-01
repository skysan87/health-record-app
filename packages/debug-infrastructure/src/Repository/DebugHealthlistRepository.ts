import type { Healthlist } from "@health-record/core/model"
import type { IHealthlistRepository, ITransactionScope as Scope } from "@health-record/core/repository"

export class DebugHealthlistRepository implements IHealthlistRepository {

  private static readonly KEY: string = 'HEALTH_LIST'

  public async get(scope: Scope): Promise<Healthlist | null> {
    const rows = await scope.get(DebugHealthlistRepository.KEY)
    const data: Healthlist | null = rows[0] ?? null
    if (data) {
      data.createdAt = new Date(data.createdAt)
      data.updatedAt = new Date(data.updatedAt)
      if (data.goalWeightRange.startDate) {
        data.goalWeightRange.startDate = new Date(data.goalWeightRange.startDate)
      }
      if (data.goalWeightRange.endDate) {
        data.goalWeightRange.endDate = new Date(data.goalWeightRange.endDate)
      }
    }
    return data
  }

  public async save(scope: Scope, data: Partial<Healthlist>): Promise<void> {
    const timestamp = new Date()
    const _data = {
      id: scope.userId,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    } as Healthlist
    await scope.create(DebugHealthlistRepository.KEY, _data)
  }

  public async update(scope: Scope, params: Partial<Healthlist>): Promise<void> {
    const clone = {
      ...params, // 更新された値
      updatedAt: new Date()
    } as Healthlist
    await scope.update(DebugHealthlistRepository.KEY, clone, scope.userId)
  }

}