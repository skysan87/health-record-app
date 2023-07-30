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
const newInputValue = ref<string | number | Date>(props.value)

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
    errorMessage.value = err.message
  } finally {
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