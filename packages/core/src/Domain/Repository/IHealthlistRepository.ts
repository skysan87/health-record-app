import type { Healthlist } from "../Model/Healthlist"
import type { ITransactionScope } from "./ITransaction"

export interface IHealthlistRepository {
  get(scope: ITransactionScope): Promise<Healthlist | null>
  save(scope: ITransactionScope, data: Partial<Healthlist>): Promise<void>
  update(scope: ITransactionScope, params: Partial<Healthlist>): Promise<void>
}