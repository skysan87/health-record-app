import { Activity } from "@/Domain/Model/Activity";
import { Activitylist } from "@/Domain/Model/Activitylist";
import { User } from "@/Domain/Model/User";
import { IActivityRepository } from "@/Domain/Repository/IActivityRepository";
import { IActivitylistRepository } from "@/Domain/Repository/IActivitylistRepository";
import { ITransaction } from "@/Domain/Repository/ITransaction";
import { IUserRepository } from "@/Domain/Repository/IUserRepository";
import { DateNumber, Menu, Record } from "@/Domain/ValueObject";
import { dateFactory } from "@/Util/DateUtil";

export class ActivityUseCase {
  constructor(
    private readonly activityRepo: IActivityRepository,
    private readonly activitylistRepo: IActivitylistRepository,
    private readonly userRepo: IUserRepository,
    private readonly transaction: ITransaction
  ) { }

  public async init(): Promise<[Activitylist, Activity]> {
    const user: User = await this.userRepo.get()
    const dateNumber: DateNumber = new DateNumber(dateFactory().getDateNumber().toString())

    let list = await this.activitylistRepo.get(user.id)
    if (!list) {
      list = await this.activitylistRepo.save(user.id)
    }

    let activity = await this.activityRepo.get(user.id, dateNumber)
    if (!activity) {
      activity = await this.activityRepo.save(user.id, dateNumber)
    }
    return [list, activity]
  }

  public async updateMenu(menu: Menu[]): Promise<Activitylist> {
    const user: User = await this.userRepo.get()
    const list = await this.activitylistRepo.get(user.id)
    if (!list) {
      throw new Error('health does not exist.')
    }
    list.menu = menu
    await this.activitylistRepo.update({ menu: list.menu }, user.id)
    return list
  }

  public async addRecord(record: Record): Promise<Activity> {
    const result = await this.transaction.run(async scope => { // TODO: scope
      const user: User = await this.userRepo.get()
      const dateNumber: DateNumber = new DateNumber(dateFactory().getDateNumber().toString())
      const activity = await this.activityRepo.get(user.id, dateNumber)
      if (!activity) {
        throw new Error('activity does not exist.')
      }
      activity.addRecord(record)
      await this.activityRepo.addRecord({ total: activity.total, records: activity.records }, record, user.id, dateNumber)

      return activity
    })
    return result as Activity
  }
}