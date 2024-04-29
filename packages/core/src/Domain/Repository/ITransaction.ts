import type { UserId } from "../ValueObject"

export interface ITransactionScope {
  get userId(): UserId
}

export interface ITransaction {
  // NOTE: 実装でITransactionScopeを指定するオブジェクトのフラグ管理をする
  run(userId: UserId, callback: (scope: ITransactionScope) => Promise<void>): Promise<void>
}