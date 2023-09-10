import { Menu } from "@health-record/core/value-object"
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
        .filter((a: Menu) => a.label !== null && a.label !== '')
        .map((a: Menu) => {
          return new Menu(a.label!.trim(), fixFloat(a.value!, 1), a.unit ? a.unit?.trim() : '')
        })
    },
    deleteRow: (index: number) => {
      input.value.splice(index, 1)
    },
    addRow: () => {
      input.value.push(new Menu(null, null, null))
    }
  }
}