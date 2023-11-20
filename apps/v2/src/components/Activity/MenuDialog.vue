<script setup lang="ts">
import { useDialog } from '@/composables/useDialog'
import { useMenu } from '@/composables/useMenu'
import type { Menu } from '@health-record/core/value-object'

const { dialog, open, cancel, submit } = useDialog()
const { list, init, updateRows, deleteRow, addRow } = useMenu()

const openAsync = (data: readonly Menu[]): Promise<{ isSuccess: boolean, data: Menu[] }> => {
  return open(() => {
    init(data)
    if (data.length === 0) {
      addRow()
    }
  }, (isCancel) => {
    return {
      isSuccess: !isCancel,
      data: isCancel ? [] : updateRows()
    }
  })
}

defineExpose({
  openAsync
})
</script>

<template>
  <dialog ref="dialog" @cancel.prevent class="p-0">
    <div class="flex flex-col py-4" style="height: 83vh;">
      <div class="flex-1 overflow-y-auto pl-4 pr-2">
        <div v-for="(menu, index) in list" :key="index" class="pb-2 flex items-center">
          <div class="flex-1 flex flex-wrap">
            <input v-model.trim="menu.label" type="text" class="flex-1 mr-1 activity-input" placeholder="メニュー名">
            <input v-model="menu.value" type="text" inputmode="decimal" class="flex-1 mr-1 activity-input"
              placeholder="消費カロリー">
            <input v-model.trim="menu.unit" type="text" class="flex-1 mr-1 activity-input" placeholder="実施単位">
          </div>
          <PartIconButton @click.stop.native="deleteRow(index)">
            <fa title="削除" :icon="['fas', 'trash-can']" size="xs" />
          </PartIconButton>
        </div>
      </div>
      <div class="flex-none border-t my-1" />
      <div class="flex-none flex flex-row mt-2 mx-2">
        <button class="btn btn-regular mr-auto" @click="addRow">
          追加
        </button>
        <button class="btn btn-outline mx-1" @click="cancel">
          Cancel
        </button>
        <button ref="okBtn" class="btn btn-regular mx-1" @click="submit">
          OK
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.activity-input {
  @apply block border border-black py-1 px-2 bg-gray-200;
}
</style>
