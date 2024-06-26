<script setup lang="ts">
import { dateFactory } from '@health-record/core/util/DateUtil'
import { useAuth } from '@/composables/useAuth'
import { useMobileLayout } from '@/composables/useMobileLayout'

const { isMenuExpanded, switchMenu, close } = useMobileLayout()

const { logout, getUserName } = useAuth()

const config = useRuntimeConfig()

const appVersion = config.public.appVersion

const currentDate: string = dateFactory().format('YYYY.M.D(ddd)')

const userName = await getUserName()

const handleLogout = async () => {
  await logout(() => {
    navigateTo('login', { replace: true })
  })
}
</script>

<template>
  <div>
    <!-- header -->
    <div class="bg-gray-800 z-30">
      <header class="container mx-auto text-white">
        <div class="flex justify-between items-center fixed w-full left-0 bg-gray-800 px-2 h-10">
          <h1 class="font-semibold text-xl leading-tight">
            <span class="font-mono">{{ currentDate }}</span>
          </h1>
          <button class="outline-none" @click.left="switchMenu">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path v-show="!isMenuExpanded" d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
              <path v-show="isMenuExpanded"
                d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          </button>
        </div>

        <div v-show="isMenuExpanded" class="fixed left-0 mt-10 w-full bg-gray-800 h-full overflow-y-scroll">
          <div class="pb-24">
            <div class="flex-none px-4">
              Ver.{{ appVersion }}
            </div>
            <div class="flex-none px-4">
              {{ userName }}
            </div>
            <div class="flex-none mt-2">
              <a class="block px-4 text-sm" @click.left="handleLogout">
                <fa :icon="['fas', 'sign-out-alt']" size="lg" />
                <span class="pl-1">ログアウト</span>
              </a>
            </div>

            <div class="flex-1 py-4">
              <div class="mt-5 px-4 flex items-center">
                <div class="font-bold text-lg">
                  メニュー
                </div>
              </div>

              <RouterLink to="/form" replace>
                <div class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75" @click.left="close">
                  # ヘルスケア
                </div>
              </RouterLink>
              <RouterLink to="/dashboard" replace>
                <div class="py-1 px-5 cursor-pointer hover:bg-blue-700 hover:opacity-75" @click.left="close">
                  # ダッシュボード
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </header>
    </div>

    <!-- contents -->
    <div class="container mx-auto pt-10 h-screen overflow-hidden">
      <slot />
    </div>
  </div>
</template>