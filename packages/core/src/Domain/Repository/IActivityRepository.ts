import { Activity } from "../Model/Activity"
import { UserId, DateNumber, Record } from "../ValueObject"
import { IRepositoryBase } from "./IRepositoryBase";

export interface IActivityRepository extends IRepositoryBase {
  get(userId: UserId, dateNumber: DateNumber): Promise<Activity>
  save(userId: UserId, dateNumber: DateNumber): Promise<Activity>
  update(params: {}, userId: UserId, dateNumber: DateNumber): Promise<Activity>
  addRecord(params: {}, record: Record, userId: UserId, dateNumber: DateNumber): Promise<Activity>
}