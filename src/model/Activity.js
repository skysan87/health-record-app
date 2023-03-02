export class Activity {
  constructor (id, params) {
    this.id = id // YYYYMMDD
    this.records = params.records ?? []
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      total: this.total,
      records: this.records,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }

  addRecord ({ timestamp, name, value }) {
    this.records.push({ timestamp, name, value })
  }

  updateRecord ({ timestamp, name, value }) {
    const index = this.records.findIndex(v => v.timestamp === timestamp)
    if (index >= 0) {
      this.records[index] = { timestamp, name, value }
    }
  }

  get total () {
    const tmp = this.records.reduce((sum, item) => sum + (item.value ?? 0), 0)
    return parseFloat(tmp.toFixed(2))
  }

  static valueOf (params) {
    return new Activity(params.id ?? '', params)
  }
}
