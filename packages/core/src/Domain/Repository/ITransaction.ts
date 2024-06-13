import type { UserId } from "../ValueObject"

export type CommandType = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'

export type Result = {
  command: CommandType
  table: string
  id: string
  data?: any
}

export interface ITransactionScope {
  get userId(): UserId
  get results(): Array<Result>
  get(...params: any): Promise<any>
  create(...params: any): Promise<void>
  update(...params: any): Promise<void>
  delete(...params: any): Promise<void>
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする
  run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void>
}