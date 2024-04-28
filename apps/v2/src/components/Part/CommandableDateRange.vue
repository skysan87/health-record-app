<script setup lang="ts">
import { DatePicker } from 'v-calendar'

type Range = { start: Date | null, end: Date | null }

interface Props {
  value: Range
  update: Function
  buttonClass?: string
  startText: string
  endText: string
}

const props = withDefaults(defineProps<Props>(), {
  value: () => ({ start: null, end: null } as Range),
  update: () => { },
  buttonClass: 'btn btn-regular',
  startText: '',
  endText: ''
})

const disabled = ref(false)
const errorMessage = ref('')
const newInputValue = ref<Range>(props.value)

const calenderAttributes = [{ // 今日に目印
  key: 'today',
  dot: 'blue',
  dates: [new Date()]
}]

const { $toast } = useNuxtApp()

const clickHandler = async () => {
  disabled.value = true
  errorMessage.value = ''

  try {
    if (props.update) {
      // NOTE: バリデーションはcallbackで実行し、エラーの場合は例外を投げる
      await props.update(newInputValue.value)
    }
  } catch (err) {
    console.error(err)
    $toast.error('コマンド実行に失敗しました')
    newInputValue.value = props.value
    errorMessage.value = (err as Error).message
  } finally {
    disabled.value = false
  }
}

const initRange = () => {
  newInputValue.value = { start: null, end: null } as Range
}
</script>

<template>
  <div class="inline-block p-1">
    <div class="flex flex-row">
      <!-- @vue-ignore -->
      <DatePicker v-model.range="newInputValue" class="flex-1" :attributes="calenderAttributes">
        <template #default="{ inputValue, togglePopover }">
          <div class="flex justify-center items-center" style="height: 68px; width: 224px">
            <PartDayCalendar :value="inputValue.start">
              <span>{{ props.startText }}</span>
            </PartDayCalendar>

            <svg class="w-4 h-4 stroke-current text-gray-600 mx-1" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>

            <PartDayCalendar :value="inputValue.end">
              <span>{{ props.endText }}</span>
            </PartDayCalendar>

            <div class="flex-none flex flex-col justify-between h-full ml-2" style="width: 45px;">
              <button class="btn btn-outline" :class="{ 'btn-disabled': disabled }" :disabled="disabled"
                @click.stop="togglePopover">
                <span style="font-size: 0.8rem;">変更</span>
              </button>

              <button class="btn btn-red-outline" :class="{ 'btn-disabled': disabled }" :disabled="disabled"
                @click.stop="initRange">
                <fa :icon="['fas', 'trash-can']" />
              </button>
            </div>
          </div>
        </template>
      </DatePicker>

      <button class="py-1 ml-2" :class="[disabled ? 'btn-disabled' : '', buttonClass]" :disabled="disabled"
        @click.stop="clickHandler">
        <fa :icon="['fas', 'floppy-disk']" />
      </button>
    </div>
    <div class="w-full p-0 m-0 leading-none">
      <span class="text-xs text-red-500">{{ errorMessage }}</span>
    </div>
  </div>
</template>
