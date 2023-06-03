import { Activitylist } from "../Model/Activitylist";
import { UserId } from "../ValueObject";
import { IRepositoryBase } from "./IRepositoryBase";

export interface IActivitylistRepository extends IRepositoryBase {
  get(userId: UserId): Promise<Activitylist>
  save(userId: UserId): Promise<Activitylist>
  update(param: {}, userId: UserId): Promise<void>
}