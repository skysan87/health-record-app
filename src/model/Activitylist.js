export class Activitylist {
  constructor (id, params) {
    this.id = id // userId
    this.menu = params.menu ?? []
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      menu: this.menu,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  addMenu (label, value, unit) {
    this.menu.push({ label, value, unit })
  }

  updateMenu (label, value, unit) {
    const index = this.menu.findIndex(v => v.label === label)
    if (index >= 0) {
      this.menu[index] = { label, value, unit }
    }
  }

  deleteMenu (label) {
    const index = this.menu.findIndex(v => v.label === label)
    if (index >= 0) {
      this.menu.splice(index, 0)
    }
  }

  static valueOf (params) {
    return new Activitylist(params.id ?? '', params)
  }
}
