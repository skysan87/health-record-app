import type { User } from "@health-record/core/model"
import type { IUserRepository } from "@health-record/core/repository"
import type { DisplayName, Mail, UserId } from "@health-record/core/value-object"
import { SessionStorage } from "../Storage/SessionStorage"

export class SessionUserRepository implements IUserRepository {

  private static readonly KEY: string = 'USER'

  private user: User | null = null

  private isInitalized: boolean = false

  public authenticated(): boolean {
    if (!this.isInitalized) {
      return false
    }
    return this.user !== null
  }

  /**
   * ログイン後のリロードであれば、ログイン情報を保持する
   */
  public async initalize(): Promise<void> {
    await this.sleep(500)
    this.user = (await SessionStorage.get(SessionUserRepository.KEY))[0] as User
    this.isInitalized = true
  }

  public async get(): Promise<User> {
    if (!this.authenticated()) {
      return Promise.reject('auth error')
    }
    return (await SessionStorage.get(SessionUserRepository.KEY))[0] as User
  }

  public getFromCache(): User {
    if (this.user === null) {
      throw new Error('auth error')
    }
    return this.user
  }

  public async login(): Promise<User> {
    return new Promise(async resolve => {
      await this.sleep(1000)
      this.user = {
        id: 'dummyId' as UserId,
        email: 'dummy@sample.com' as Mail,
        displayName: 'dummy user' as DisplayName
      } as User
      await SessionStorage.create(SessionUserRepository.KEY, this.user)
      resolve(this.user)
    })
  }

  public async logout(): Promise<void> {
    await this.sleep(800)
    await SessionStorage.delete(SessionUserRepository.KEY, this.user?.id)
    this.user = null
  }

  private sleep(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}