import { ActivitylistBehavior } from "../Domain/Behavior/ActivitylistBehavior";
import { ActivityBehavior } from "../Domain/Behavior/ActivityBehavior";
import { Activity } from "../Domain/Model/Activity";
import { Activitylist } from "../Domain/Model/Activitylist";
import { User } from "../Domain/Model/User";
import { IActivityRepository } from "../Domain/Repository/IActivityRepository";
import { IActivitylistRepository } from "../Domain/Repository/IActivitylistRepository";
import { ITransaction } from "../Domain/Repository/ITransaction";
import { IUserRepository } from "../Domain/Repository/IUserRepository";
import { DateNumber, Menu, Record } from "../Domain/ValueObject";
import { dateFactory } from "../Util/DateUtil";

export class ActivityUseCase {
  constructor(
    private readonly activityRepo: IActivityRepository,
    private readonly activitylistRepo: IActivitylistRepository,
    private readonly userRepo: IUserRepository,
    private readonly transaction: ITransaction
  ) { }

  public async init(): Promise<[Activitylist, Activity]> {
    const user: User = await this.userRepo.get()
    const dateNumber: DateNumber = dateFactory().getDateNumber().toString() as DateNumber

    let list = await this.activitylistRepo.get(user.id)
    if (!list) {
      list = new ActivitylistBehavior({ id: user.id } as Activitylist).format()
      await this.activitylistRepo.save(user.id, list)
    }

    let activity = await this.activityRepo.get(user.id, dateNumber)
    if (!activity) {
      activity = new ActivityBehavior({ id: dateNumber } as Activity).format()
      await this.activityRepo.save(user.id, dateNumber, activity)
    }
    return [
      new ActivitylistBehavior(list).format(),
      new ActivityBehavior(activity).format()
    ]
  }

  public async updateMenu(menu: Menu[]): Promise<Activitylist> {
    const user: User = await this.userRepo.get()
    const list = await this.activitylistRepo.get(user.id)
    if (!list) {
      throw new Error('activity does not exist.')
    }
    return await new ActivitylistBehavior(list).actionAsync(async behavir => {
      await this.activitylistRepo.update({ menu }, user.id)
      behavir.update({ menu } as Activitylist)
    })
  }

  public async addRecord(record: Record): Promise<Activity> {
    let result: Activity

    await this.transaction.run(async () => {
      const user: User = await this.userRepo.get()
      const dateNumber: DateNumber = dateFactory().getDateNumber().toString() as DateNumber
      const activity = await this.activityRepo.get(user.id, dateNumber)
      if (!activity) {
        throw new Error('activity does not exist.')
      }
      result = await new ActivityBehavior(activity).actionAsync(async behavior => {
        behavior.addRecord(record)
        await this.activityRepo.addRecord({ total: behavior.get('total') }, record, user.id, dateNumber)
      })
    })

    return result!
  }

  public async getActivityHistory(): Promise<Activity[]> {
    const user: User = await this.userRepo.get()
    return this.activityRepo.getList(user.id)
  }
}