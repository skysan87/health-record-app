import { ActivityUseCase, HealthUseCase, AuthenticateUseCase } from '@health-record/core/usecase'

declare module '#app' {
  interface NuxtApp {
    $activity: ActivityUseCase,
    $health: HealthUseCase
    $auth: AuthenticateUseCase
  }
}