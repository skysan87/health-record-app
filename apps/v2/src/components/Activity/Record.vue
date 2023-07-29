<script setup lang="ts">
import MenuDialog from '@/components/Activity/MenuDialog.vue'
import { ActivityStore } from '~/composables/useActivityStore'

const { activitylist, input, activityOther, menulist, records, onChangeActivity, calcKcal, recordActivity, updateMenu } = inject('activity') as ActivityStore
const dialog = ref<InstanceType<typeof MenuDialog>>()

const open = async () => {
  const { isSuccess, data } = await dialog.value?.openAsync(activitylist.value.menu)
  if (isSuccess) {
    await updateMenu(data)
  }
}
</script>

<template>
  <div>
    <MenuDialog ref="dialog" />

    <div class="flex flex-row">
      <div class="flex-1">
        <span>運動メニュー</span>
        <div v-for="m in menulist" :key="m.label">
          <label class="ml-2 align-middle">
            <input v-model="input.selectedActivity" type="radio" :value="m" @change="onChangeActivity">
            <span>{{ m.label }}</span>
          </label>
        </div>
        <div class="flex items-center">
          <label class="ml-2 align-middle">
            <input v-model="input.selectedActivity" type="radio" :value="activityOther" @change="onChangeActivity">
            <span>{{ activityOther.label }}</span>
          </label>
          <input v-model="input.otherMenuLabel" type="text" class="ml-2 input-text" style="width: fit-content;">
        </div>
      </div>
      <div class="flex-none">
        <button class="m-1 h-8 w-8 btn btn-outline" @click="open">
          <fa :icon="['fas', 'edit']" size="sm" />
        </button>
      </div>
    </div>

    <div class="border-b pt-2" />

    <div class="pt-2">
      <div class="pb-2">
        <div class="flex items-center">
          <span>実施単位</span>
          <span v-if="input.selectedActivity?.unit" class="ml-1 badge bg-blue-200">
            {{ input.selectedActivity?.value }}kcal / {{ input.selectedActivity?.unit }}
          </span>
        </div>
        <input v-model="input.valueUnit" type="number" inputmode="decimal" class="input-text" placeholder="実装した回数を追加"
          @input="calcKcal">
      </div>
      <div>
        <span>消費エネルギー</span>
        <span class="output-text">{{ input.valueKcal ?? 0 }}</span>
      </div>

      <div class="pt-2">
        <button class="btn btn-regular" @click="recordActivity">
          登録
        </button>
      </div>
    </div>

    <div class="border-b pt-2" />

    <PartExpandPanel right class="pt-2">
      <template #title>
        <span>今日の実績</span>
      </template>
      <template #component>
        <!-- TODO: 反映されない -->
        <div v-for="r in records" :key="r.timestamp.getTime()">
          {{ r.timestamp }} - {{ r.name }} : {{ r.value }}
        </div>
      </template>
    </PartExpandPanel>
  </div>
</template>

