import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const { checkLogin } = useAuth()
  const authenticated = await checkLogin()
  console.log(to.path)
  if (!authenticated && to.path !== '/login') {
    return navigateTo('login')
  }
  // if (!authenticated && to.path === '/login') {
  //   // TODO: ROOT_PATH
  //   return navigateTo('')
  // }
})