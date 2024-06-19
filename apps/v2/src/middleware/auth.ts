import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkLogin, waitForInit } = useAuth()

  await waitForInit()

  if (!checkLogin()) {
    return navigateTo('/login', { replace: true })
  }
})