<script setup lang="ts">

interface Props {
  inputType: string
  value: string | number | Date
  update: Function
  buttonClass?: string
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'text',
  value: null,
  update: () => {},
  buttonClass: 'btn btn-regular',
  inputmode: 'text'
})

const disabled = ref(false)
const errorMessage = ref('')
const newInputValue = ref(props.value)

const clickHandler = async () => {
  disabled.value = true
  errorMessage.value = ''
  let hasError = false

  try {
    if (props.update) {
      // NOTE: バリデーションはcallbackで実行し、エラーの場合は例外を投げる
      const result = await props.update(newInputValue.value)
      // NOTE: callback内の非同期処理の例外はキャッチできないので、戻り値で判定
      if (!result) {
        console.info('callback action failed')
        hasError = true
      }
    }
  } catch (err) {
    console.error(err)
    hasError = true
    errorMessage.value = err.message
  } finally {
    if (hasError) {
      newInputValue.value = props.value
    }
    disabled.value = false
  }
}
</script>

<template>
  <div class="inline-block p-1">
    <div class="flex flex-row">
      <input
        v-model="newInputValue"
        :type="props.inputType"
        class="flex-1 border p-1 bg-gray-200"
        :class="{ 'btn-disabled': disabled }"
        :disabled="disabled"
        :inputmode="props.inputmode"
      >
      <button
        class="p-1 ml-2"
        :class="[disabled ? 'btn-disabled' : '', props.buttonClass]"
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