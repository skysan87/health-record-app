<template>
  <div>
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
          <!-- <input type="text" class="ml-2 input-text" style="width: fit-content;"> -->
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
          <span
            v-if="selectedActivity?.unit"
            class="ml-1 badge bg-blue-200"
          >
            {{ selectedActivity?.value }}kcal / {{ selectedActivity?.unit }}
          </span>
        </div>
        <input
          v-model="valueUnit"
          type="number"
          inputmode="decimal"
          class="input-text"
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

    <div class="border-b pt-2" />

    <expand-panel right class="pt-2">
      <template #title>
        <span>今日の実績</span>
      </template>
      <template #component>
        <div v-for="r in records" :key="r.id">
          {{ r.timestamp }} - {{ r.name }} : {{ r.value }}
        </div>
      </template>
    </expand-panel>
  </div>
</template>

<script>
import Vue from 'vue'
import ActivityMenuDialog from '@/components/ActivityMenuDialog'
import ExpandPanel from '@/components/parts/ExpandPanel'
import { dateFactory } from '@/util/DateFactory'

const DialogController = Vue.extend(ActivityMenuDialog)

const activityOther = { label: 'その他', value: 1, unit: '' }

export default {

  components: {
    ExpandPanel
  },

  data () {
    return {
      activityOther,
      selectedActivity: null,
      valueKcal: null,
      valueUnit: null,
      dialog: null
    }
  },

  computed: {
    activityMenu () {
      return this.$store.getters['Activity/getMenu']
    },

    records () {
      const items = this.$store.getters['Activity/getRecords']
      return items.map((item, index) => {
        return {
          id: index,
          timestamp: dateFactory(item.timestamp).format('HH:mm'),
          name: item.name,
          value: item.value
        }
      })
    }
  },

  methods: {
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

    recordActivity () {
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
