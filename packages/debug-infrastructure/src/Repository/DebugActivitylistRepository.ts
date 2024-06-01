import type { Activitylist } from "@health-record/core/model"
import type { IActivitylistRepository, ITransactionScope as Scope } from "@health-record/core/repository"

export class DebugActivitylistRepository implements IActivitylistRepository {

  private static readonly KEY: string = 'ACTIVITY_LIST'

  public async get(scope: Scope): Promise<Activitylist | null> {
    const rows = await (await scope.get(DebugActivitylistRepository.KEY))
    const data: Activitylist | null = rows[0] ?? null
    if (data) {
      data.createdAt = new Date(data.createdAt)
      data.updatedAt = new Date(data.updatedAt)
    }
    return data
  }

  public async save(scope: Scope, data: Partial<Activitylist>): Promise<void> {
    const timestamp = new Date()
    const _data = {
      id: scope.userId,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    } as Activitylist
    await scope.create(DebugActivitylistRepository.KEY, _data)
  }

  public async update(scope: Scope, params: {}): Promise<void> {
    const clone = {
      ...params, // 更新された値
      updatedAt: new Date()
    } as Activitylist
    await scope.update(DebugActivitylistRepository.KEY, clone, scope.userId)
  }
}