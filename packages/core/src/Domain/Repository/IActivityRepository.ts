import type { Activity } from "../Model/Activity"
import type { UserId, DateNumber, Record } from "../ValueObject"
import type { IRepositoryBase } from "./IRepositoryBase"

export interface IActivityRepository extends IRepositoryBase {
  get(userId: UserId, dateNumber: DateNumber): Promise<Activity | null>
  getList(userId: UserId): Promise<Activity[]>
  save(userId: UserId, dateNumber: DateNumber, data: Partial<Activity>): Promise<void>
  update(params: Partial<Activity>, userId: UserId, dateNumber: DateNumber): Promise<void>
  addRecord(params: Partial<Activity>, record: Record, userId: UserId, dateNumber: DateNumber): Promise<void>
}