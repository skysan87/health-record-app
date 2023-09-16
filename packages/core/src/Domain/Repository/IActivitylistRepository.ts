import { Activitylist } from "../Model/Activitylist";
import { UserId } from "../ValueObject";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IActivitylistRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Activitylist | null>
  save(userId: UserId, data: Partial<Activitylist>): Promise<void>
  update(param: {}, userId: UserId): Promise<void>
}