export class Healthlist {
  constructor (id, params) {
    this.id = id
    this.latest = params.latest ?? {}
    this.createdAt = params.createdAt ?? null
    this.updatedAt = params.updatedAt ?? null
  }

  getData () {
    return {
      latest: this.latest,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
