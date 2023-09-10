import type { Activity } from "@health-record/core/model"
import { UserId, DateNumber, Record } from "@health-record/core/value-object"
import { IActivityRepository } from "@health-record/core/repository"

export class DebugActivityRepository implements IActivityRepository {

  private memory: Map<string, Activity> = new Map<string, Activity>()

  constructor() { }

  get(userId: UserId, dateNumber: DateNumber): Promise<Activity | null> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber.value) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = { id: dateNumber.value } as Activity
      this.memory.set(dateNumber.value, data)
      resolve(data)
    })
  }

  update(params: Partial<Activity>, userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber.value) ?? {} as Activity
      const clone = {
        ...data,
        ...params // 更新された値
      } as Activity
      this.memory.set(dateNumber.value, clone)
      resolve(clone)
    })
  }

  addRecord(params: Partial<Activity>, newRecord: Record, userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber.value) ?? {} as Activity
      const records = data.records ?? []
      records.push(newRecord)
      const clone = {
        ...data,
        ...params, // 更新された値
        records
      } as Activity
      this.memory.set(dateNumber.value, clone)
      resolve(clone)
    })
  }
}