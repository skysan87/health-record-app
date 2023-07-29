<script setup lang="ts">
import { ActivityStore } from '@/composables/useActivityStore'
import { HealthStore } from '@/composables/useHealthStore'
import { HealthGoalType } from "@health-record/core/value-object"

const { initActivity, totalCalorie } = inject('activity') as ActivityStore
const { healthlist, latestData, goal, initHealth, recordWeight, recordHeight, setGoalActivity, setGoalWeight } = inject('health') as HealthStore

const menu = {
  Activity: { label: '運動', value: 'activity' },
  Health: { label: '測定値', value: 'health' },
  Goal: { label: '目標値', value: 'goal' }
} as const

type menu = typeof menu[keyof typeof menu]

const selectedMenu = ref<menu>(menu.Activity)

const notAchievedGoal = computed(() => {
  const goal = healthlist.value?.goal[HealthGoalType.ACTIVITY] ?? 0
  return totalCalorie.value < goal
})

// TODO: mobile対応
definePageMeta({
  layout: 'board'
})

const init = async () => {
  await Promise.all([initActivity(), initHealth()])
}

onBeforeMount(async () => await init())
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-none pt-2 px-2 flex flex-wrap">
      <span class="ml-2">
        <button title="リロード" @click="init">
          <fa :icon="['fas', 'sync-alt']" size="lg" />
        </button>
      </span>
      <span class="ml-2">●運動 <span :class="{'text-red-500': notAchievedGoal}">{{ totalCalorie.toFixed(2) }}kcal</span></span>
      <span class="ml-2">●体重 {{ latestData?.weight }}kg</span>
      <span class="ml-2">●BMI <span :class="{'text-red-500': healthlist?.isOutOfLineBMI}">{{ healthlist?.BMI.toFixed(2) }}</span></span>
    </div>

    <!-- ラジオボタンで表示切り替え -->
    <div class="flex-none flex flex-row pt-2 px-2">
      <label v-for="m in menu" :key="m.value" class="ml-2 align-middle">
        <input v-model="selectedMenu" type="radio" :value="m">
        <span>{{ m.label }}</span>
      </label>
    </div>

    <div class="border-b pt-2" />

    <div class="flex-1 overflow-y-auto pb-6">
      <!-- 健康記録 -->
      <div v-if="selectedMenu.value === menu.Health.value" class="pt-2 px-2">
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">体重(kg)</span>
          <PartCommandableInput
            key="latest-waight"
            input-type="number"
            :value="latestData?.weight"
            :update="recordWeight"
            inputmode="decimal" />
        </div>
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">身長(cm)</span>
          <PartCommandableInput
            key="latest-height"
            input-type="number"
            :value="latestData?.height"
            :update="recordHeight"
            inputmode="decimal"
          />
        </div>
      </div>

      <!-- 目標設定 -->
      <div v-else-if="selectedMenu.value === menu.Goal.value" class="pt-2 px-2">
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">運動量(kcal)</span>
          <PartCommandableInput
            key="goal-activity"
            input-type="number"
            :value="goal?.activity"
            :update="setGoalActivity"
            inputmode="decimal"
          />
        </div>
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">体重(kg)</span>
          <PartCommandableInput
            key="goal-weight"
            input-type="number"
            :value="goal?.weight"
            :update="setGoalWeight"
            inputmode="decimal"
          />
        </div>
      </div>

      <!-- 運動記録 -->
      <ActivityRecord v-else-if="selectedMenu.value === menu.Activity.value" class="pt-2 px-2" />
    </div>
  </div>
</template>