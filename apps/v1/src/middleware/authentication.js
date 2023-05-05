export default function ({ store, redirect, route }) {
  if (!store.getters['User/isLogin'] && route.name !== 'login') {
    redirect('/login')
  }
  if (store.getters['User/isLogin'] && route.name === 'login') {
    redirect(process.env.ROOT_PATH)
  }
}
