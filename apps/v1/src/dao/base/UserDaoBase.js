import { authMock } from '@/plugins/mock'

export class UserDaoBase {
  async login () {
    return await authMock.login()
  }

  async logout () {
    await authMock.logout()
    return true
  }

  async getAuthChanged () {
    await authMock.sleep(800)
    return new Promise(resolve => resolve(authMock.loginUser))
  }
}
