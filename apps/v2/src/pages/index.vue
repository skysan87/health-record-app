<script setup lang="ts">
import { dateFactory } from '@health-record/core/util/DateUtil'

const { recordWeight, initHealth } = inject('health') as HealthStore
const { input, activityOther, initActivity, recordActivity } = inject('activity') as ActivityStore
const { checkLogin, initialized } = useAuth()

type LoginState = 'before_auth' | 'auth_ok' | 'auth_ng'

input.valueUnit = 1
input.selectedActivity = { ...activityOther }

const loginState = ref<LoginState>('before_auth')
const weightValue = ref<number>(0)
const config = useRuntimeConfig()
const currentDate: string =dateFactory().format('YYYY.M.D(ddd)')

const checkAuthenticated = async () => {
  if (checkLogin()) {
    await Promise.all([initActivity(), initHealth()])
    loginState.value = 'auth_ok'
  } else {
    loginState.value = 'auth_ng'
  }
}

const recordWeightAction = async () => {
  await recordWeight(weightValue.value)
  weightValue.value = 0
}

const gotoTop = () => {
  navigateTo(config.public.rootPath, { replace: true })
}

const gotoLogin = () => {
  navigateTo('/login', { replace: true })
}

watch(initialized, ()=> {
  if (initialized) {
    checkAuthenticated()
  }
})

onMounted(()=>{
  checkAuthenticated()
})
</script>

<template>
  <div class="px-2">
    <h1 class="text-3xl font-bold py-2">クイック入力</h1>
    <div><span class="font-mono">{{ currentDate }}</span></div>

    <div>
      <button v-if="loginState === 'auth_ok'" class="btn btn-regular" @click="gotoTop">
        TOPページ
      </button>
    </div>

    <div class="border-b pt-4" />

    <div>
      <span>体重(kg)</span>
      <div class="flex items-center">
        <input v-model="weightValue" type="number" inputmode="decimal" class="input-text" style="width: 224px;">
        <span class="pl-2">
          <button v-if="loginState === 'auth_ok'" class="btn btn-regular" @click="recordWeightAction">
            登録
          </button>
          <button v-else-if="loginState === 'auth_ng'" class="btn btn-regular" @click="gotoLogin">
            ログインして登録
          </button>
        </span>
      </div>
    </div>

    <div class="border-b pt-4" />

    <div class="pt-2">
      <div>
        <span>運動メニュー</span>
        <div class="flex items-center">
          <input v-model="input.otherMenuLabel" type="text" class="input-text" style="width: 224px;">
        </div>
      </div>
      <div>
        <span>消費エネルギー(kcal)</span>
        <div class="flex items-center">
          <input v-model="input.valueKcal" type="number" inputmode="decimal" class="input-text" placeholder="0"
            style="width: 224px;">
          <span class="pl-2">
            <button v-if="loginState === 'auth_ok'" class="btn btn-regular" @click="recordActivity">
              登録
            </button>
            <button v-else-if="loginState === 'auth_ng'" class="btn btn-regular" @click="gotoLogin">
              ログインして登録
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>