<template>
  <div class="inline-block p-1">
    <div class="flex flex-row">
      <v-date-picker
        v-model="newInputValue"
        is-range
        class="flex-1"
        :attributes="calenderAttributes"
      >
        <template #default="{ inputValue, togglePopover }">
          <div class="flex justify-center items-center" style="height: 68px; width: 224px">
            <day-calendar :value="inputValue.start" />

            <svg
              class="w-4 h-4 stroke-current text-gray-600 mx-1"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>

            <day-calendar :value="inputValue.end" />

            <div class="flex-none flex flex-col justify-between h-full ml-2" style="width: 45px;">
              <button
                class="btn btn-outline"
                :class="{'btn-disabled' : disabled}"
                :disabled="disabled"
                @click.stop="togglePopover"
              >
                <span style="font-size: 0.8rem;">変更</span>
              </button>

              <button
                class="btn btn-red-outline"
                :class="{'btn-disabled' : disabled}"
                :disabled="disabled"
                @click.stop="initRange"
              >
                <fa :icon="['fas', 'trash-can']" />
              </button>
            </div>
          </div>
        </template>
      </v-date-picker>

      <button
        class="py-1 ml-2"
        :class="[disabled ? 'btn-disabled' : '', buttonClass]"
        :disabled="disabled"
        @click.stop="clickHandler"
      >
        <fa :icon="['fas', 'floppy-disk']" />
      </button>
    </div>
    <div class="w-full p-0 m-0 leading-none">
      <span class="text-xs text-red-500">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import DayCalendar from '@/components/parts/DayCalendar'

export default {
  name: 'CommandableDateRange',

  components: {
    DayCalendar
  },

  props: {
    /**
     * 初期値
     */
    value: {
      type: Object,
      require: false,
      default: () => ({ start: null, end: null })
    },
    /**
     * 更新処理をするコールバック
     */
    update: {
      type: Function,
      require: true,
      default: null
    },
    /**
     * ボタンのstyle
     */
    buttonClass: {
      type: String,
      require: false,
      default: 'btn btn-regular'
    }
  },

  data () {
    return {
      disabled: false,
      errorMessage: '',
      newInputValue: { ...this.value },
      calenderAttributes: [{ // 今日に目印
        key: 'today',
        dot: 'blue',
        dates: [new Date()]
      }]
    }
  },

  methods: {
    async clickHandler () {
      this.disabled = true
      this.errorMessage = ''
      let hasError = false

      try {
        if (this.update) {
          // NOTE: バリデーションはcallbackで実行し、エラーの場合は例外を投げる
          const result = await this.update(this.newInputValue)
          // NOTE: callback内の非同期処理の例外はキャッチできないので、戻り値で判定
          if (!result) {
            console.info('callback action failed')
            hasError = true
          }
        }
      } catch (err) {
        console.error(err)
        hasError = true
        this.errorMessage = err.message
      } finally {
        if (hasError) {
          this.newInputValue = this.value
        }
        this.disabled = false
      }
    },

    initRange () {
      this.newInputValue = { start: null, end: null }
    }
  }
}
</script>
