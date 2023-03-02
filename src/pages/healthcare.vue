<template>
  <div>
    <div class="pt-2 px-2 flex flex-wrap">
      <span class="ml-2">
        <button title="リロード" @click="init">
          <fa :icon="['fas', 'sync-alt']" size="lg" />
        </button>
      </span>
      <span class="ml-2">●運動 {{ totalCalorie }}kcal</span>
      <span class="ml-2">●体重 {{ latestData?.weight }}kg</span>
      <span class="ml-2">●BMI {{ BMI }}</span>
    </div>

    <!-- ラジオボタンで表示切り替え -->
    <div class="flex-1 flex flex-row pt-2 px-2">
      <label v-for="m in menu" :key="m.value" class="ml-2 align-middle">
        <input v-model="selectedMenu" type="radio" :value="m" @change="changeMenu">
        <span>{{ m.label }}</span>
      </label>
    </div>

    <div class="border-b pt-2" />

    <!-- 健康記録 -->
    <div v-if="selectedMenu === menu.Health" class="pt-2 px-2">
      <div class="pb-1 flex items-start">
        <span class="p-2">体重</span>
        <commandable-input
          input-type="number"
          :value="latestData?.weight"
          :update="recordWeight"
        />
      </div>
      <div class="pb-1 flex items-start">
        <span class="p-2">身長</span>
        <commandable-input
          input-type="number"
          :value="latestData?.height"
          :update="recordHeight"
        />
      </div>
    </div>

    <!-- 運動記録 -->
    <div v-if="selectedMenu === menu.Activity" class="pt-2 px-2">
      <div class="flex flex-row">
        <div class="flex-1">
          <span>運動メニュー</span>
          <div v-for="m in activityMenu" :key="m.label">
            <label class="ml-2 align-middle">
              <input v-model="selectedActivity" type="radio" :value="m" @change="onChangeActivity">
              <span>{{ m.label }}</span>
            </label>
          </div>
          <div class="flex items-center">
            <label class="ml-2 align-middle">
              <input v-model="selectedActivity" type="radio" :value="activityOther" @change="onChangeActivity">
              <span>{{ activityOther.label }}</span>
            </label>
            <input type="text" class="ml-2 input-text" style="width: fit-content;">
          </div>
        </div>
        <div class="flex-none">
          <button class="m-1 h-8 w-8 btn btn-outline" @click="openDialog">
            <fa :icon="['fas', 'edit']" size="sm" />
          </button>
        </div>
      </div>

      <div class="border-b pt-2" />

      <div class="pt-2">
        <div class="pb-2">
          <div class="flex items-center">
            <span>実施単位</span>
            <span v-if="selectedActivity?.unit" class="ml-1 badge bg-blue-200">{{ selectedActivity?.value }}kcal / {{ selectedActivity?.unit }}</span>
          </div>
          <input
            v-model="valueUnit"
            type="number"
            class="input-text"
            step="1"
            placeholder="実装した回数を追加"
            @input="calcKcal"
          >
        </div>
        <div>
          <span>消費エネルギー</span>
          <span class="output-text">{{ valueKcal ?? 0 }}</span>
        </div>

        <div class="pt-2">
          <button class="btn btn-regular" @click="recordActivity">
            登録
          </button>
        </div>
      </div>
    </div>

    <!-- TODO: 記録の表示・編集 -->
  </div>
</template>

<script>
import Vue from 'vue'
import ActivityMenuDialog from '@/components/ActivityMenuDialog'
import { Health } from '@/model/Health'
import { fixFloat } from '@/util/NumberUtil'
import CommandableInput from '@/components/parts/CommandableInput'

const DialogController = Vue.extend(ActivityMenuDialog)

const menu = {
  Activity: { label: '運動', value: 'activity' },
  Health: { label: '健康', value: 'health' }
}

const healthType = { weight: Health.TYPE_WEIGHT, height: Health.TYPE_HEIGHT }

const activityOther = { label: 'その他', value: 1, unit: '' }

export default {

  components: {
    CommandableInput
  },

  layout: ctx => ctx.$device.isMobile ? 'board_mobile' : 'board',

  data () {
    return {
      menu,
      healthType,
      selectedMenu: null,
      activityOther,
      selectedActivity: null,
      valueKcal: null,
      valueUnit: null,
      valueHealth: null,
      dialog: null
    }
  },

  computed: {
    latestData () {
      return this.$store.getters['Health/getLatest']
    },

    BMI () {
      return this.$store.getters['Health/calcBMI']
    },

    activityMenu () {
      return this.$store.getters['Activity/getMenu']
    },

    totalCalorie () {
      const cal = this.$store.getters['Activity/getTotal']
      return parseFloat(cal.toFixed(2))
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

    changeMenu () {
      this.valueUnit = null
      this.valueKcal = null
      this.valueHealth = null
    },

    onChangeActivity () {
      if (!this.selectedActivity) {
        return
      }
      this.valueUnit = null
      this.valueKcal = null
    },

    calcKcal () {
      if (!this.selectedActivity) {
        return
      }
      const data = this.valueUnit * this.selectedActivity.value
      this.valueKcal = parseFloat(data.toFixed(2))
    },

    openDialog () {
      delete this.dialog
      this.dialog = new DialogController({
        propsData: {
          parent: this.$root.$el,
          target: this.activityMenu
        }
      })
      this.dialog.$on('update', (result) => {
        this.$store.dispatch('Activity/updateMenu', result)
          .then(() => {
            this.clearActivityInput()
          })
          .catch((error) => {
            console.error(error)
            this.$toast.error('更新に失敗しました')
          })
      })
      this.dialog.$mount()
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

    recordActivity () {
      if (this.selectedMenu !== menu.Activity) {
        return
      }

      if (!this.selectedActivity) {
        return
      }

      this.$store.dispatch('Activity/addRecord', {
        timestamp: new Date(),
        name: this.selectedActivity.label,
        value: this.valueKcal
      })
        .then(() => {
          this.clearActivityInput()
        })
        .catch((error) => {
          console.error(error)
          this.$toast.error('登録に失敗しました')
        })
    },
    clearActivityInput () {
      this.selectedActivity = null
      this.valueKcal = null
      this.valueUnit = null
    }
  }
}
</script>
