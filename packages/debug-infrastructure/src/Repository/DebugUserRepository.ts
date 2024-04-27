import type { User } from "@health-record/core/model"
import type { IUserRepository } from "@health-record/core/repository"
import type { DisplayName, Mail, UserId } from "@health-record/core/value-object"

export class DebugUserRepository implements IUserRepository {

  private user: User | null = null

  public get(): Promise<User> {
    if (!this.authenticated()) {
      return Promise.reject('auth error')
    }
    return Promise.resolve(this.user as User)
  }

  public authenticated(): Promise<boolean> {
    return Promise.resolve(this.user !== null)
  }

  public async login(): Promise<User> {
    await this.sleep(1000)
    this.user = {
      id: 'dummyId' as UserId,
      email: 'dummy@sample.com' as Mail,
      displayName: 'dummy user' as DisplayName
    } as User
    return this.user
  }

  public async logout(): Promise<void> {
    await this.sleep(800)
    this.user = null
  }

  private sleep(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}