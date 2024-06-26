import type { User } from "@health-record/core/model"
import type { IUserRepository } from "@health-record/core/repository"
import type { DisplayName, Mail, UserId } from "@health-record/core/value-object"

export class DebugUserRepository implements IUserRepository {

  private user: User | null = null

  private _skipAuth: boolean = false

  private isInitalized: boolean = false

  constructor(skipAuth = false) {
    this._skipAuth = skipAuth
  }

  public async initalize(): Promise<void> {
    if (this._skipAuth) {
      await this.login() // 起動時のみ自動ログイン
    }
    this.isInitalized = true
  }

  public get(): Promise<User> {
    if (!this.authenticated()) {
      return Promise.reject(new Error('auth error'))
    }
    return Promise.resolve(this.user as User)
  }

  public getFromCache(): User {
    if (this.user === null) {
      throw new Error('auth error')
    }
    return this.user
  }

  public authenticated(): boolean {
    if (!this.isInitalized) {
      return false
    }
    return this.user !== null
  }

  public login(): Promise<User> {
    return new Promise(async resolve => {
      if (!this._skipAuth) {
        await this.sleep(1000)
      }
      this.user = {
        id: 'dummyId' as UserId,
        email: 'dummy@sample.com' as Mail,
        displayName: 'dummy user' as DisplayName
      } as User
      resolve(this.user)
    })
  }

  public async logout(): Promise<void> {
    if (!this._skipAuth) {
      await this.sleep(800)
    }
    this.user = null
  }

  private sleep(msec: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}