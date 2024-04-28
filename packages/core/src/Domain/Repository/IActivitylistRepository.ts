import type { Activitylist } from "../Model/Activitylist"
import type { UserId } from "../ValueObject"
import type { IRepositoryBase } from "./IRepositoryBase"

export interface IActivitylistRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Activitylist | null>
  save(userId: UserId, data: Partial<Activitylist>): Promise<void>
  update(param: {}, userId: UserId): Promise<void>
}