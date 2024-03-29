import type { NuxtError } from "@nuxt/types"
import type { User } from "@health-record/core/model"
import { AuthenticateUseCase } from "@health-record/core/usecase"

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const usecase: AuthenticateUseCase = $auth()

  return {
    login: async (onSuccess = (credential: User) => { }, onError = (error: NuxtError) => { }) => {
      try {
        const user = await usecase.login()
        onSuccess(user)
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    checkLogin: async (): Promise<boolean> => {
      try {
        return await usecase.checkLogin()
      } catch (error) {
        console.log(error)
        return false
      }
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