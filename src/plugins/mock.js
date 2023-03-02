class AuthObserver {
  constructor () {
    this.callback = null
  }

  sleep (msec) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }

  async login () {
    const user = this.loginUser
    await this.sleep(800)
    if (this.callback !== null) {
      this.callback(user)
    }
    return user
  }

  async logout () {
    const user = {
      uid: '',
      email: '',
      displayName: '',
      isGuest: true
    }
    await this.sleep(800)
    if (this.callback !== null) {
      this.callback(user)
    }
  }

  onAuthStateChanged = (_callback) => {
    this.callback = _callback
  }

  get loginUser () {
    return {
      uid: 'dummyId',
      email: 'dummy@mail.com',
      displayName: 'dummy user',
      isGuest: false
    }
  }
}

export const authMock = new AuthObserver()
