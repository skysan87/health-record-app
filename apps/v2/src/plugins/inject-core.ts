import { ActivityUseCase, HealthUseCase } from '@health-record/core/usecase'
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
  }
}

// 使い方: https://nuxt.com/docs/guide/directory-structure/plugins#automatically-providing-helpers
export default defineNuxtPlugin(() => {
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

  return {
    provide: {
      activity: () => activity,
      health: () => health
    }
  }
})
