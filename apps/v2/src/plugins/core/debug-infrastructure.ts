import { ActivityUseCase, HealthUseCase, AuthenticateUseCase } from '@health-record/core/usecase'
import { DebugActivityRepository } from '@health-record/debug-infrastructure/repository/DebugActivityRepository'
import { DebugActivitylistRepository } from '@health-record/debug-infrastructure/repository/DebugActivitylistRepository'
import { DebugHealthRepository } from '@health-record/debug-infrastructure/repository/DebugHealthRepository'
import { DebugHealthlistRepository } from '@health-record/debug-infrastructure/repository/DebugHealthlistRepository'
import { DebugTransaction } from '@health-record/debug-infrastructure/repository/DebugTransaction'
import { DebugUserRepository } from '@health-record/debug-infrastructure/repository/DebugUserRepository'

// @ts-ignore #appのaliasが有効にならない(tsconfig.json)
declare module '#app' {
  interface NuxtApp {
    $activity(): ActivityUseCase,
    $health(): HealthUseCase
    $auth(): AuthenticateUseCase
  }
}

export default defineNuxtPlugin(() => {

  console.log('install debug-infrastructure')

  const userRepo = new DebugUserRepository()
  const transaction = new DebugTransaction()
  const activity = new ActivityUseCase(
    new DebugActivityRepository()
    , new DebugActivitylistRepository()
    , userRepo
    , transaction
  )
  const health = new HealthUseCase(
    new DebugHealthRepository()
    , new DebugHealthlistRepository()
    , userRepo
    , transaction
  )
  const auth = new AuthenticateUseCase(userRepo)

  return {
    provide: {
      activity: () => activity,
      health: () => health,
      auth: () => auth
    }
  }
})
