import type { Health } from "../Domain/Model/Health"
import type { User } from "../Domain/Model/User"
import type { IHealthRepository } from "../Domain/Repository/IHealthRepository"
import type { IHealthlistRepository } from "../Domain/Repository/IHealthlistRepository"
import type { IUserRepository } from "../Domain/Repository/IUserRepository"
import type { ITransaction } from "../Domain/Repository/ITransaction"
import type { HealthGoalType, HealthType } from "../Domain/ValueObject"
import type { Healthlist } from "../Domain/Model/Healthlist"
import { HealthlistBehavior } from "../Domain/Behavior/HealthlistBehavior"
import { HealthBehavior } from "../Domain/Behavior/HealthBehavior"
import { dateFactory } from "../Util/DateUtil"

// NOTE: 小規模なソースコードなので、ドメイン知識単位にUseCaseをまとめる
export class HealthUseCase {

  constructor(
    private readonly healthRepo: IHealthRepository,
    private readonly healthlistRepo: IHealthlistRepository,
    private readonly userRepo: IUserRepository,
    private readonly transaction: ITransaction
  ) { }

  public async init(): Promise<Healthlist> {
    let result: Healthlist

    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {
      let list: Healthlist | null = await this.healthlistRepo.get(scope)
      if (!list) {
        list = new HealthlistBehavior({ id: user.id } as Healthlist).format()
        await this.healthlistRepo.save(scope, list)
      }
      result = new HealthlistBehavior(list).format()

      // TODO: 取得したデータを保存する
      this.healthRepo.sync(scope)
    })

    return result!
  }

  public async addRecord(type: HealthType, value: number): Promise<Healthlist> {
    // 通信時間を考慮
    const date = dateFactory()

    let result: Healthlist

    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {
      const list = await this.healthlistRepo.get(scope)
      if (!list) {
        throw new Error('health does not exist.')
      }

      result = await new HealthlistBehavior(list).actionAsync(async behavior => {
        const latest = behavior.get('latest') ?? {}
        latest[type] = value
        await this.healthlistRepo.update(scope, { latest })
        behavior.update({ latest } as Healthlist)

        const healthBehavior = new HealthBehavior({
          year: date.get('year'),
          month: date.get('month'),
          date: date.get('date'),
          type,
          value
        } as Health)
        await this.healthRepo.save(scope, healthBehavior.format())
      })
    })

    return result!
  }

  public async updateGoal(type: HealthGoalType, value: number): Promise<Healthlist> {
    let result: Healthlist
    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {

      const list = await this.healthlistRepo.get(scope)
      if (!list) {
        throw new Error('health does not exist.')
      }

      result = await new HealthlistBehavior(list).actionAsync(async behavior => {
        const goal = behavior.get('goal') ?? {}
        goal[type] = value
        await this.healthlistRepo.update(scope, { goal })
        behavior.update({ goal } as Healthlist)
      })
    })

    return result!
  }

  public async updateGoalWeightRange(startDate: Date, endDate: Date): Promise<Healthlist> {
    let result: Healthlist
    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {
      const list = await this.healthlistRepo.get(scope)
      if (!list) {
        throw new Error('health does not exist.')
      }

      result = await new HealthlistBehavior(list).actionAsync(async behavior => {
        if (!behavior.validateGoalWeightRange()) {
          throw new Error('goal.weight and latest.weight must be set.')
        }
        behavior.setGoalWeightRange(startDate, endDate)
        await this.healthlistRepo.update(scope, { goalWeightRange: behavior.get("goalWeightRange") })
      })
    })

    return result!
  }

  public async getRecords(): Promise<Health[]> {
    // TODO: limit
    let result: Health[]
    const user: User = await this.userRepo.get()

    await this.transaction.run(user.id, async (scope) => {
      result = await this.healthRepo.get(scope)
    })
    return result!
  }
}