import { getAuth, setPersistence, browserLocalPersistence, signInWithRedirect, GoogleAuthProvider, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth'
import { firebaseApp } from '@/plugins/firebase'
import { UserDaoBase } from '@/dao/base/UserDaoBase'

export class UserDao extends UserDaoBase {
  constructor () {
    super()
    this.auth = getAuth(firebaseApp)
    setPersistence(this.auth, browserLocalPersistence)
  }

  async login () {
    const provider = new GoogleAuthProvider()
    await signInWithRedirect(this.auth, provider)
    const result = await getRedirectResult(this.auth)
    if (result !== null) {
      return result.user
    } else {
      return null
    }
  }

  async logout () {
    await signOut(this.auth)
    return true
  }

  getAuthChanged () {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.auth,
        user => resolve(user),
        err => reject(err)
      )
    })
  }
}
