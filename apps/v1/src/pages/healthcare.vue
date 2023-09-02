<template>
  <div class="flex flex-col h-full">
    <div class="flex-none pt-2 px-2 flex flex-wrap">
      <span class="ml-2">
        <button title="リロード" @click="init">
          <fa :icon="['fas', 'sync-alt']" size="lg" />
        </button>
      </span>
      <span class="ml-2">●運動 <span :class="{'text-red-500': notAchievedGoal}">{{ totalCalorie }}kcal</span></span>
      <span class="ml-2">●体重 {{ latestData?.weight }}kg</span>
      <span class="ml-2">●BMI <span :class="{'text-red-500': isOutOfLineBMI}">{{ BMI }}</span></span>
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
      <div v-if="selectedMenu === menu.Health" class="pt-2 px-2">
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">体重(kg)</span>
          <commandable-input
            key="latest-waight"
            input-type="number"
            :value="latestData?.weight"
            :update="recordWeight"
            inputmode="decimal"
          />
        </div>
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">身長(cm)</span>
          <commandable-input
            key="latest-height"
            input-type="number"
            :value="latestData?.height"
            :update="recordHeight"
            inputmode="decimal"
          />
        </div>
      </div>

      <!-- 目標設定 -->
      <div v-else-if="selectedMenu === menu.Goal" class="pt-2 px-2">
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">運動量(kcal)</span>
          <commandable-input
            key="goal-activity"
            input-type="number"
            :value="goal?.activity"
            :update="setGoalActivity"
            inputmode="decimal"
          />
        </div>
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">体重(kg)</span>
          <commandable-input
            key="goal-weight"
            input-type="number"
            :value="goal?.weight"
            :update="setGoalWeight"
            inputmode="decimal"
          />
        </div>
        <div class="pb-1 flex items-center">
          <span class="p-2 w-1/4">期間設定</span>
          <!-- TODO: 現在の体重と目標体重を同時に更新するようにする -->
          <commandable-date-range
            key="goal-period"
            :value="{ start: range.startDate, end: range.endDate }"
            :update="setGoalWeightRange"
          />
        </div>
      </div>

      <!-- 運動記録 -->
      <activity-record v-else-if="selectedMenu === menu.Activity" class="pt-2 px-2" />
    </div>
  </div>
</template>

<script>
import { Health } from '@/model/Health'
import { Healthlist } from '@/model/Healthlist'
import { fixFloat } from '@/util/NumberUtil'
import { dateFactory } from '@/util/DateFactory'
import CommandableInput from '@/components/parts/CommandableInput'
import CommandableDateRange from '@/components/parts/CommandableDateRange'
import ActivityRecord from '@/components/ActivityRecord'

const menu = {
  Activity: { label: '運動', value: 'activity' },
  Health: { label: '測定値', value: 'health' },
  Goal: { label: '目標値', value: 'goal' }
}

export default {

  components: {
    CommandableInput,
    CommandableDateRange,
    ActivityRecord
  },

  layout: ctx => ctx.$device.isMobile ? 'board_mobile' : 'board',

  data () {
    return {
      menu,
      selectedMenu: menu.Activity
    }
  },

  async fetch () {
    await this.init()
  },

  computed: {
    latestData () {
      return this.$store.getters['Health/getLatest']
    },

    BMI () {
      return this.$store.getters['Health/calcBMI']
    },

    totalCalorie () {
      const cal = this.$store.getters['Activity/getTotal']
      return parseFloat(cal.toFixed(2))
    },

    goal () {
      return this.$store.getters['Health/getGoal']
    },

    range () {
      return this.$store.getters['Health/getGoalWeightRange']
    },

    notAchievedGoal () {
      const latest = this.$store.getters['Activity/getTotal'] ?? 0
      const goal = this.$store.getters['Health/getGoal'][Healthlist.GOAL_ACTIVITY] ?? 0
      return latest < goal
    },

    isOutOfLineBMI () {
      const bmi = this.$store.getters['Health/calcBMI']
      if (!bmi) {
        return false
      }
      return bmi <= 18.5 || bmi >= 25.0
    }
  },

  methods: {
    async init () {
      try {
        await this.$store.dispatch('Health/init')
        await this.$store.dispatch('Activity/init')
      } catch (error) {
        console.error(error)
        this.$toast.error('初期化に失敗しました')
      }
    },

    // コールバック処理
    async recordWeight (inputValue) {
      if (!inputValue) {
        return true
      }
      try {
        await this.$store.dispatch('Health/add', {
          type: Health.TYPE_WEIGHT,
          value: fixFloat(inputValue)
        })
      } catch (error) {
        console.log(error)
        this.$toast.error('登録に失敗しました')
        return false
      }
      return true
    },

    // コールバック処理
    async recordHeight (inputValue) {
      if (!inputValue) {
        return true
      }
      try {
        await this.$store.dispatch('Health/add', {
          type: Health.TYPE_HEIGHT,
          value: fixFloat(inputValue)
        })
      } catch (error) {
        console.log(error)
        this.$toast.error('登録に失敗しました')
        return false
      }
      return true
    },

    // コールバック処理
    async setGoalActivity (inputValue) {
      if (!inputValue) {
        return true
      }
      try {
        await this.$store.dispatch('Health/updateGoal', {
          type: Healthlist.GOAL_ACTIVITY,
          value: fixFloat(inputValue)
        })
      } catch (error) {
        console.log(error)
        this.$toast.error('登録に失敗しました')
        return false
      }
      return true
    },

    // コールバック処理
    async setGoalWeight (inputValue) {
      if (!inputValue) {
        return true
      }
      try {
        await this.$store.dispatch('Health/updateGoal', {
          type: Healthlist.GOAL_WEIGHT,
          value: fixFloat(inputValue)
        })
      } catch (error) {
        console.log(error)
        this.$toast.error('登録に失敗しました')
        return false
      }
      return true
    },

    // コールバック処理
    async setGoalWeightRange (inputValue) {
      let startDate, endDate

      if (!inputValue) {
        startDate = null
        endDate = null
      } else {
        startDate = dateFactory(inputValue.start, 'YYYY/MM/DD').toDate()
        endDate = dateFactory(inputValue.end, 'YYYY/MM/DD').toDate()
      }

      try {
        await this.$store.dispatch('Health/updateGoalWeightRange', {
          start: startDate,
          end: endDate
        })
        return {
          isSuccess: true,
          message: ''
        }
      } catch (error) {
        console.log(error)
        this.$toast.error('登録に失敗しました')
        return {
          isSuccess: false,
          message: error.message
        }
      }
    }
  }
}
</script>
