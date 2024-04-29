import { ActivityUseCase, HealthUseCase, AuthenticateUseCase } from '@health-record/core/usecase'
import { UserRepository } from '@health-record/firebase-infrastructure/repository/UserRepository'
import { ActivityRepository } from '@health-record/firebase-infrastructure/repository/ActivityRepository'
import { ActivitylistRepository } from '@health-record/firebase-infrastructure/repository/ActivitylistRepository'
import { HealthRepository } from '@health-record/firebase-infrastructure/repository/HealthRepository'
import { HealthlistRepository } from '@health-record/firebase-infrastructure/repository/HealthlistRepository'
import { Firestoreransaction } from '@health-record/firebase-infrastructure/repository/Transaction'
import { startEmulator } from '@health-record/firebase-infrastructure/Emulator'

export default defineNuxtPlugin(() => {

  console.log('install firebase-local-infrastructure')

  const userRepo = new UserRepository()
  const transaction = new Firestoreransaction()
  const activity = new ActivityUseCase(
    new ActivityRepository()
    , new ActivitylistRepository()
    , userRepo
    , transaction
  )
  const health = new HealthUseCase(
    new HealthRepository()
    , new HealthlistRepository()
    , userRepo
    , transaction
  )
  const auth = new AuthenticateUseCase(userRepo)

  startEmulator()

  return {
    provide: {
      activity: () => activity,
      health: () => health,
      auth: () => auth
    }
  }
})
