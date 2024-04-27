import type { Healthlist } from "../Model/Healthlist"
import type { UserId } from "../ValueObject"
import type { IRepositoryBase } from "./IRepositoryBase"

export interface IHealthlistRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Healthlist | null>
  save(userId: UserId, data: Partial<Healthlist>): Promise<void>
  update(params: Partial<Healthlist>, userId: UserId): Promise<void>
}