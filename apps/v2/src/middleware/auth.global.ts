import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkLogin } = useAuth()

  if (!checkLogin() && to.path !== '/login') {
    return navigateTo('/login', { replace: true })
  }
})