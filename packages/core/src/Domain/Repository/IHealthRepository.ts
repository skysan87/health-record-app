import type { Health } from "../Model/Health"
import type { UserId } from "../ValueObject"
import type { IRepositoryBase } from "./IRepositoryBase"

export interface IHealthRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Health[]>
  save(params: Health, userId: UserId): Promise<void>
}