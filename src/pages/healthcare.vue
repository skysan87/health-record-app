<template>
  <div>
    <div class="pt-2 px-2 flex flex-wrap">
      <span class="ml-2">
        <button title="リロード" @click="init">
          <fa :icon="['fas', 'sync-alt']" size="lg" />
        </button>
      </span>
      <span class="ml-2">●運動 <span :class="{'text-red-500': notAchievedGoal}">{{ totalCalorie }}kcal</span></span>
      <span class="ml-2">●体重 {{ latestData?.weight }}kg</span>
      <span class="ml-2">●BMI {{ BMI }}</span>
    </div>

    <!-- ラジオボタンで表示切り替え -->
    <div class="flex-1 flex flex-row pt-2 px-2">
      <label v-for="m in menu" :key="m.value" class="ml-2 align-middle">
        <input v-model="selectedMenu" type="radio" :value="m">
        <span>{{ m.label }}</span>
      </label>
    </div>

    <div class="border-b pt-2" />

    <!-- 健康記録 -->
    <div v-show="selectedMenu === menu.Health" class="pt-2 px-2">
      <div class="pb-1 flex items-center">
        <span class="p-2 w-1/4">体重(kg)</span>
        <commandable-input
          id="hoge1"
          input-type="number"
          :value="latestData?.weight"
          :update="recordWeight"
          inputmode="decimal"
        />
      </div>
      <div class="pb-1 flex items-center">
        <span class="p-2 w-1/4">身長(cm)</span>
        <commandable-input
          id="hoge2"
          input-type="number"
          :value="latestData?.height"
          :update="recordHeight"
          inputmode="decimal"
        />
      </div>
    </div>

    <!-- 目標設定 -->
    <div v-show="selectedMenu === menu.Goal" class="pt-2 px-2">
      <div class="pb-1 flex items-center">
        <span class="p-2 w-1/4">運動量(kcal)</span>
        <span>{{ goal?.activity }}</span>
        <commandable-input
          id="hoge3"
          input-type="number"
          :value="goal?.activity"
          :update="setGoalActivity"
          inputmode="decimal"
        />
      </div>
      <div class="pb-1 flex items-center">
        <span class="p-2 w-1/4">体重(kg)</span>
        <commandable-input
          id="hoge4"
          input-type="number"
          :value="goal?.weight"
          :update="setGoalWeight"
          inputmode="decimal"
        />
      </div>
    </div>

    <!-- 運動記録 -->
    <activity-record v-show="selectedMenu === menu.Activity" class="pt-2 px-2" />
  </div>
</template>

<script>
import { Health } from '@/model/Health'
import { Healthlist } from '@/model/Healthlist'
import { fixFloat } from '@/util/NumberUtil'
import CommandableInput from '@/components/parts/CommandableInput'
import ActivityRecord from '@/components/ActivityRecord'

const menu = {
  Activity: { label: '運動', value: 'activity' },
  Health: { label: '測定値', value: 'health' },
  Goal: { label: '目標値', value: 'goal' }
}

export default {

  components: {
    CommandableInput,
    ActivityRecord
  },

  layout: ctx => ctx.$device.isMobile ? 'board_mobile' : 'board',

  data () {
    return {
      menu,
      selectedMenu: menu.Activity
    }
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

    notAchievedGoal () {
      const latest = this.$store.getters['Activity/getTotal'] ?? 0
      const goal = this.$store.getters['Health/getGoal'][Healthlist.GOAL_ACTIVITY] ?? 0
      return latest < goal
    }
  },

  mounted () {
    this.init()
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
    }
  }
}
</script>
