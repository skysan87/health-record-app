import type { NuxtError } from "@nuxt/types"
import type { User } from "@health-record/core/model"
import { AuthenticateUseCase } from "@health-record/core/usecase"

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const usecase: AuthenticateUseCase = $auth()
  const userInfo = ref<User>()

  return {
    login: async (onSuccess = (credential: User) => { }, onError = (error: NuxtError) => { }) => {
      try {
        const user = await usecase.login()
        userInfo.value = user
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
        userInfo.value = {} as User
        onSuccess()
      } catch (error) {
        onError(createError(error as NuxtError))
      }
    },
    userName: computed<string>(() => {
      return userInfo.value?.displayName?.value ?? ''
    })
  }
}