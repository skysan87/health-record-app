import type { Activitylist } from "../Model/Activitylist"
import type { ITransactionScope } from "./ITransaction"

export interface IActivitylistRepository {
  get(scope: ITransactionScope): Promise<Activitylist | null>
  save(scope: ITransactionScope, data: Partial<Activitylist>): Promise<void>
  update(scope: ITransactionScope, param: {}): Promise<void>
}