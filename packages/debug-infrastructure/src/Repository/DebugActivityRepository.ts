import type { Activity } from "@health-record/core/model"
import type { DateNumber, Record } from "@health-record/core/value-object"
import type { IActivityRepository, ITransactionScope as Scope } from "@health-record/core/repository"

export class DebugActivityRepository implements IActivityRepository {

  private static readonly KEY: string = 'ACTIVITY'

  private async getData(scope: Scope): Promise<Activity[]> {
    const data: Activity[] = await scope.get(DebugActivityRepository.KEY)
    return data.map((d: Activity) => {
      return {
        ...d,
        records: d.records.map(r => ({ ...r, timestamp: new Date(r.timestamp) })),
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      }
    })
  }

  public async get(scope: Scope, dateNumber: DateNumber): Promise<Activity | null> {
    return (await this.getData(scope)).find(h => h.id === dateNumber) ?? null
  }

  public getList(scope: Scope): Promise<Activity[]> {
    return this.getData(scope)
  }

  public async save(scope: Scope, dateNumber: DateNumber, data: Partial<Activity>): Promise<void> {
    const timestamp = new Date()
    const _data = {
      id: dateNumber,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    } as Activity

    await scope.create(DebugActivityRepository.KEY, _data)
  }

  public async update(scope: Scope, params: Partial<Activity>, dateNumber: DateNumber): Promise<void> {
    await scope.update(
      DebugActivityRepository.KEY,
      { ...params, updatedAt: new Date() } as Activity,
      dateNumber
    )
  }

  public async addRecord(scope: Scope, params: Partial<Activity>, newRecord: Record, dateNumber: DateNumber): Promise<void> {
    const memory = await this.getData(scope)
    const index = memory.findIndex(h => h.id === dateNumber)
    const records = memory[index].records ?? []
    records.push(newRecord)

    const clone = {
      ...params, // 更新された値
      records,
      updatedAt: new Date()
    } as Activity

    await scope.update(
      DebugActivityRepository.KEY,
      clone,
      dateNumber
    )
  }
}