import { setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, type UserCredential, type User } from "firebase/auth"
import type { User as UserModel } from "@health-record/core/model"
import type { IUserRepository } from "@health-record/core/repository"
import type { DisplayName, Mail, UserId } from "@health-record/core/value-object"
import { auth } from "../AppSetting"

export class UserRepository implements IUserRepository {

  private _user: UserModel | null = null

  constructor() {
    setPersistence(auth, browserLocalPersistence)
  }

  public async authenticated(): Promise<boolean> {
    if (this._user !== null) {
      return true
    }
    this._user = await this.getAuthChanged()
    return this._user !== null
  }

  public get(): Promise<UserModel> {
    return Promise.resolve(this._user as UserModel)
  }

  public async login(): Promise<UserModel> {
    const provider = new GoogleAuthProvider()
    const result: UserCredential = await signInWithPopup(auth, provider)
    if (!!result?.user) {
      this._user = this.convert(result.user)
      return this._user
    } else {
      throw new Error('[Firebase] login failed.')
    }
  }

  public async logout(): Promise<void> {
    // TODO: clear cache
    this._user = null
    await signOut(auth)
  }

  private getAuthChanged(): Promise<UserModel | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth,
        user => {
          unsubscribe()
          if (user?.uid !== undefined && user?.uid !== null && user?.uid !== '') {
            this._user = this.convert(user!)
          }
          resolve(this._user)
        },
        err => reject(err)
      )
    })
  }

  private convert(user: User): UserModel {
    return {
      id: user.uid as UserId,
      email: user.email as Mail,
      displayName: user.displayName as DisplayName
    } as UserModel
  }
}