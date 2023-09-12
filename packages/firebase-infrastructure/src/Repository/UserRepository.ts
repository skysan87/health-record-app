import { setPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, UserCredential, User } from "firebase/auth"
import { User as UserModel } from "@health-record/core/model"
import { IUserRepository } from "@health-record/core/repository"
import { Mail } from "@health-record/core/value-object"
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
    if (!this._user) {
      return Promise.reject('auth error')
    }
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
    await signOut(auth)
  }

  private getAuthChanged(): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth,
        user => {
          unsubscribe()
          resolve(this.convert(user!))
        },
        err => reject(err)
      )
    })
  }

  private convert(user: User): UserModel {
    return {
      id: user.uid,
      email: user.email as Mail,
      displayName: user.displayName
    } as UserModel
  }
}