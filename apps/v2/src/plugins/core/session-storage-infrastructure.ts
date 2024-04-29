import { ActivityUseCase, HealthUseCase, AuthenticateUseCase } from '@health-record/core/usecase'
import { DebugActivityRepository } from '@health-record/debug-infrastructure/repository/DebugActivityRepository'
import { DebugActivitylistRepository } from '@health-record/debug-infrastructure/repository/DebugActivitylistRepository'
import { DebugHealthRepository } from '@health-record/debug-infrastructure/repository/DebugHealthRepository'
import { DebugHealthlistRepository } from '@health-record/debug-infrastructure/repository/DebugHealthlistRepository'
import { SessionStorageTransaction } from '@health-record/debug-infrastructure/repository/DebugTransaction'
import { SessionUserRepository } from '@health-record/debug-infrastructure/repository/SessionUserRepository'

export default defineNuxtPlugin(() => {

  console.log('install session-storage-infrastructure')

  const userRepo = new SessionUserRepository()
  const transaction = new SessionStorageTransaction()
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
      activity: activity,
      health: health,
      auth: auth
    }
  }
})
