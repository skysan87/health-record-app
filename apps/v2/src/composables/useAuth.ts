import type { NuxtError } from "@nuxt/types"
import type { User } from "@health-record/core/model"
import { AuthenticateUseCase } from "@health-record/core/usecase"

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const usecase: AuthenticateUseCase = $auth

  const initialized = useState<boolean>('authenticated', () => false)

  return {
    initialized: readonly(initialized),
    init: async () => {
      initialized.value = await usecase.initalize()
      console.log('init Auth')
    },
    waitForInit: async () => {
      if (initialized.value) return
      const retryCount =  10
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      for (let index = 0; index < retryCount; index++) {
        await wait(300)
        if (initialized.value) {
          return
        }
      }
    },
    login: async (onSuccess = (credential: User) => { }, onError = (error: NuxtError) => { }) => {
      try {
        const user = await usecase.login()
        onSuccess(user)
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    checkLogin: (): boolean => {
      return usecase.authenticated()
    },
    logout: async (onSuccess = () => { }, onError = (error: NuxtError) => { }) => {
      try {
        await usecase.logout()
        onSuccess()
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    getUserName: async () => {
      const user = await usecase.getUser()
      return user.displayName ?? ''
    }
  }
}