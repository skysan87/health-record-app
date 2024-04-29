import type { Activity } from "@health-record/core/model"
import type { DateNumber, Record } from "@health-record/core/value-object"
import type { IActivityRepository } from "@health-record/core/repository"
import type { AbstractStorage as Scope } from "../Storage/AbstractStorage"

export class DebugActivityRepository implements IActivityRepository {

  private static readonly KEY: string = 'ACTIVITY'

  private getData(scope: Scope): Activity[] {
    const data: Activity[] = scope.get(DebugActivityRepository.KEY) ?? []
    return data.map((d: Activity) => {
      return {
        ...d,
        records: d.records.map(r => ({ ...r, timestamp: new Date(r.timestamp) })),
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      }
    })
  }

  get(scope: Scope, dateNumber: DateNumber): Promise<Activity | null> {
    return new Promise(resolve => {
      const data = this.getData(scope)
      resolve(structuredClone(data.find(h => h.id === dateNumber) ?? null))
    })
  }

  getList(scope: Scope): Promise<Activity[]> {
    return Promise.resolve(this.getData(scope))
  }

  save(scope: Scope, dateNumber: DateNumber, data: Partial<Activity>): Promise<void> {
    return new Promise(resolve => {
      const timestamp = new Date()
      const _data = {
        id: dateNumber,
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      } as Activity

      const memory = this.getData(scope)
      memory.push(_data)
      scope.save(DebugActivityRepository.KEY, memory)

      resolve()
    })
  }

  update(scope: Scope, params: Partial<Activity>, dateNumber: DateNumber): Promise<void> {
    return new Promise(resolve => {
      const memory = this.getData(scope)
      const index = memory.findIndex(h => h.id === dateNumber)

      const clone = {
        ...memory[index],
        ...params, // 更新された値
        updatedAt: new Date()
      } as Activity
      memory[index] = clone
      scope.save(DebugActivityRepository.KEY, memory)

      resolve()
    })
  }

  async addRecord(scope: Scope, params: Partial<Activity>, newRecord: Record, dateNumber: DateNumber): Promise<void> {
    return new Promise(resolve => {
      const memory = this.getData(scope)
      const index = memory.findIndex(h => h.id === dateNumber)
      const records = memory[index].records ?? []
      records.push(newRecord)

      const clone = {
        ...memory[index],
        ...params, // 更新された値
        records,
        updatedAt: new Date()
      } as Activity
      memory[index] = clone
      scope.save(DebugActivityRepository.KEY, memory)

      resolve()
    })
  }
}