import type { Activity } from "@health-record/core/model"
import { UserId, DateNumber, Record } from "@health-record/core/value-object"
import { IActivityRepository } from "@health-record/core/repository"

export class DebugActivityRepository implements IActivityRepository {

  private memory: Map<DateNumber, Activity> = new Map<DateNumber, Activity>()

  constructor() { }

  get(userId: UserId, dateNumber: DateNumber): Promise<Activity | null> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber) ?? null
      resolve(structuredClone(data))
    })
  }

  save(userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = { id: dateNumber } as Activity
      this.memory.set(dateNumber, data)
      resolve(data)
    })
  }

  update(params: Partial<Activity>, userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber) ?? {} as Activity
      const clone = {
        ...data,
        ...params // 更新された値
      } as Activity
      this.memory.set(dateNumber, clone)
      resolve(clone)
    })
  }

  addRecord(params: Partial<Activity>, newRecord: Record, userId: UserId, dateNumber: DateNumber): Promise<Activity> {
    return new Promise(resolve => {
      const data = this.memory.get(dateNumber) ?? {} as Activity
      const records = data.records ?? []
      records.push(newRecord)
      const clone = {
        ...data,
        ...params, // 更新された値
        records
      } as Activity
      this.memory.set(dateNumber, clone)
      resolve(clone)
    })
  }
}