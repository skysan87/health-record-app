import { ActivitylistBehavior } from "../Domain/Behavior/ActivitylistBehavior"
import { ActivityBehavior } from "../Domain/Behavior/ActivityBehavior"
import type { Activity } from "../Domain/Model/Activity"
import type { Activitylist } from "../Domain/Model/Activitylist"
import type { User } from "../Domain/Model/User"
import type { IActivityRepository } from "../Domain/Repository/IActivityRepository"
import type { IActivitylistRepository } from "../Domain/Repository/IActivitylistRepository"
import type { ITransaction } from "../Domain/Repository/ITransaction"
import type { IUserRepository } from "../Domain/Repository/IUserRepository"
import type { DateNumber, Menu, Record } from "../Domain/ValueObject"
import { dateFactory } from "../Util/DateUtil"

export class ActivityUseCase {
  constructor(
    private readonly activityRepo: IActivityRepository,
    private readonly activitylistRepo: IActivitylistRepository,
    private readonly userRepo: IUserRepository,
    private readonly transaction: ITransaction
  ) { }

  public async init(): Promise<[Activitylist, Activity]> {
    let activitylist: Activitylist, activity: Activity

    const user: User = await this.userRepo.get()
    const dateNumber: DateNumber = dateFactory().getDateNumber().toString() as DateNumber

    // NOTE: FirebaseError: Firestore transactions require all reads to be executed before all writes.
    await this.transaction.run(user.id, async (scope) => {
      let list = await this.activitylistRepo.get(scope)
      if (!list) {
        list = new ActivitylistBehavior({ id: user.id } as Activitylist).format()
        await this.activitylistRepo.save(scope, list)
      }
      activitylist = new ActivitylistBehavior(list).format()
    })

    await this.transaction.run(user.id, async (scope) => {
      let _activity = await this.activityRepo.get(scope, dateNumber)
      if (!_activity) {
        _activity = new ActivityBehavior({ id: dateNumber } as Activity).format()
        await this.activityRepo.save(scope, dateNumber, _activity)
      }
      activity = new ActivityBehavior(_activity).format()
    })

    return [activitylist!, activity!]
  }

  public async updateMenu(menu: Menu[]): Promise<Activitylist> {
    let result: Activitylist

    const user: User = await this.userRepo.get()
    await this.transaction.run(user.id, async (scope) => {
      const list = await this.activitylistRepo.get(scope)
      if (!list) {
        throw new Error('activity does not exist.')
      }

      result = await new ActivitylistBehavior(list).actionAsync(async behavir => {
        await this.activitylistRepo.update(scope, { menu })
        behavir.update({ menu } as Activitylist)
      })
    })
    return result!
  }

  public async addRecord(record: Record): Promise<Activity> {
    let result: Activity
    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {
      const dateNumber: DateNumber = dateFactory().getDateNumber().toString() as DateNumber
      const activity = await this.activityRepo.get(scope, dateNumber)
      if (!activity) {
        throw new Error('activity does not exist.')
      }
      result = await new ActivityBehavior(activity).actionAsync(async behavior => {
        behavior.addRecord(record)
        await this.activityRepo.addRecord(scope, { total: behavior.get('total') }, record, dateNumber)
      })
    })

    return result!
  }

  public async getActivityHistory(): Promise<Activity[]> {
    let result: Activity[]

    const user: User = await this.userRepo.get()
    await this.transaction.run(user.id, async (scope) => {
      result = await this.activityRepo.getList(scope)
    })
    return result!
  }
}