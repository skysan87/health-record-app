import type { Health } from "../Model/Health"
import type { ITransactionScope } from "./ITransaction"

export interface IHealthRepository {
  get(scope: ITransactionScope): Promise<Health[]>
  sync(scope: ITransactionScope): Promise<void>
  save(scope: ITransactionScope, params: Health): Promise<void>
}