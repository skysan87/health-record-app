import type { Activity } from "../Model/Activity"
import type { DateNumber, Record } from "../ValueObject"
import type { ITransactionScope } from "./ITransaction"

export interface IActivityRepository {
  get(scope: ITransactionScope, dateNumber: DateNumber): Promise<Activity | null>
  getList(scope: ITransactionScope): Promise<Activity[]>
  save(scope: ITransactionScope, dateNumber: DateNumber, data: Partial<Activity>): Promise<void>
  update(scope: ITransactionScope, params: Partial<Activity>, dateNumber: DateNumber): Promise<void>
  addRecord(scope: ITransactionScope, params: Partial<Activity>, record: Record, dateNumber: DateNumber): Promise<void>
}