import type { ITransactionScope, Result } from "@health-record/core/repository"
import { type UserId } from "@health-record/core/value-object"
import { SessionStorage } from "../Storage/SessionStorage"

export class SessionStorageScope implements ITransactionScope {

  private records: Array<Result> = []

  constructor(private _userId: UserId) { }

  get results(): Result[] {
    return structuredClone(this.records)
  }

  get userId(): UserId {
    return this._userId
  }

  public async get(table: string): Promise<Array<any>> {
    return SessionStorage.get(table)
  }

  public async create(table: string, data: any): Promise<void> {
    await SessionStorage.create(table, data)

    this.records.push({
      command: "CREATE",
      table: table,
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async update(table: string, data: any, id: any): Promise<void> {
    await SessionStorage.update(table, data, id)

    this.records.push({
      command: "UPDATE",
      table: table,
      id: data.id,
      data: { ...data }
    } as Result)
  }

  public async delete(table: string, id: any): Promise<void> {
    await SessionStorage.delete(table, id)

    this.records.push({
      command: "DELETE",
      table: table,
      id: id
    } as Result)
  }
}