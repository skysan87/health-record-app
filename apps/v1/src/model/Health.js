export class Health {
  static TYPE_WEIGHT = 'weight'
  static TYPE_HEIGHT = 'height'

  constructor (id, params) {
    const today = new Date()
    this.id = id
    this.year = params.year ?? today.getFullYear()
    this.month = params.month ?? today.getMonth() + 1
    this.date = params.date ?? today.getDate()
    this.type = params.type ?? null
    this.value = params.value ?? null
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      year: this.year,
      month: this.month,
      date: this.date,
      type: this.type,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
