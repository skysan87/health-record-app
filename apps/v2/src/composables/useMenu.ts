import { type Menu, validMenu } from "@health-record/core/value-object"
import { fixFloat } from '@health-record/core/util/NumberUtil'

export const useMenu = () => {
  const input = ref<Menu[]>([])

  return {
    list: input,
    init: (value: readonly Menu[]): void => {
      input.value = value.map(menu => {
        return {
          label: menu.label,
          value: menu.value,
          unit: menu.unit
        } as Menu
      })
    },
    updateRows: (): Menu[] => {
      return input.value
        .filter((a: Menu) => validMenu(a))
        .map((a: Menu) => {
          return {
            label: a.label!.trim(),
            value: fixFloat(a.value!, 1),
            unit: a.unit ? a.unit?.trim() : ''
          } as Menu
        })
    },
    deleteRow: (index: number) => {
      input.value.splice(index, 1)
    },
    addRow: () => {
      input.value.push({ label: null, value: null, unit: null })
    }
  }
}