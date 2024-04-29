import type { Activitylist } from "@health-record/core/model"
import type { IActivitylistRepository } from "@health-record/core/repository"
import { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class DebugActivitylistRepository implements IActivitylistRepository {

  private static readonly KEY: string = 'ACTIVITY_LIST'

  get(scope: Scope): Promise<Activitylist | null> {
    return new Promise(resolve => {
      const data: Activitylist | null = scope.get(DebugActivitylistRepository.KEY)
      if (data) {
        data.createdAt = new Date(data.createdAt)
        data.updatedAt = new Date(data.updatedAt)
      }
      resolve(structuredClone(data))
    })
  }

  save(scope: Scope, data: Partial<Activitylist>): Promise<void> {
    return new Promise(resolve => {
      const timestamp = new Date()
      const _data = {
        id: scope.userId,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Activitylist
      scope.save(DebugActivitylistRepository.KEY, _data)
      resolve()
    })
  }

  update(scope: Scope, params: {}): Promise<void> {
    return new Promise(resolve => {
      const data = scope.get(DebugActivitylistRepository.KEY) ?? {} as Activitylist
      const clone = {
        ...data,
        ...params, // 更新された値
        updatedAt: new Date()
      } as Activitylist
      scope.save(DebugActivitylistRepository.KEY, clone)
      resolve()
    })
  }
}