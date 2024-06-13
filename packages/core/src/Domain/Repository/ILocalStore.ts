import { UserId } from '../ValueObject'
import type { ITransactionScope, Result } from './ITransaction'

export interface ILocalStore {
  sync(results: Array<Result>): void
  load(table: string, option?: any): any
  createScope(userId: UserId): ITransactionScope
}