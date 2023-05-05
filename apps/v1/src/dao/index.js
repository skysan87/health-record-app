import * as base from '@/dao/base'
import * as fb from '@/dao/firebase'

const FB_MODE = process.env.DATABASE_MODE !== 'local'
const GOOGLE_AUTH_MODE = process.env.GOOGLE_AUTH === '1'

export function CreateUserDao () {
  return GOOGLE_AUTH_MODE ? new fb.UserDao() : new base.UserDaoBase()
}

export function CreateActivityDao () {
  return FB_MODE ? new fb.ActivityDao() : new base.ActivityDaoBase()
}

export function CreateHealthDao () {
  return FB_MODE ? new fb.HealthDao() : new base.HealthDaoBase()
}
