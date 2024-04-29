import type { Healthlist } from "@health-record/core/model"
import type { IHealthlistRepository } from "@health-record/core/repository"
import type { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class DebugHealthlistRepository implements IHealthlistRepository {

  private static readonly KEY: string = 'HEALTH_LIST'

  get(scope: Scope): Promise<Healthlist | null> {
    return new Promise(resolve => {
      const data: Healthlist | null = scope.get(DebugHealthlistRepository.KEY)
      if (data) {
        data.createdAt = new Date(data.createdAt)
        data.updatedAt = new Date(data.updatedAt)
      }
      resolve(structuredClone(data))
    })
  }

  save(scope: Scope, data: Partial<Healthlist>): Promise<void> {
    return new Promise(resolve => {
      const timestamp = new Date()
      const _data = {
        id: scope.userId,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Healthlist
      scope.save(DebugHealthlistRepository.KEY, _data)
      resolve()
    })
  }

  update(scope: Scope, params: Partial<Healthlist>): Promise<void> {
    return new Promise(resolve => {
      const data = scope.get(DebugHealthlistRepository.KEY) ?? {} as Healthlist
      const clone = {
        ...data,
        ...params, // 更新された値
        updatedAt: new Date()
      } as Healthlist
      scope.save(DebugHealthlistRepository.KEY, clone)
      resolve()
    })
  }

}