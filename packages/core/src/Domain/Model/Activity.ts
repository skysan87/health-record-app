import { Record } from "../ValueObject"

export class Activity {
  constructor(
    public id: string,
    public total: number = 0,
    public records: Record[] = [],
    public createdAt?: Date,
    public updatedAt?: Date,
  ) { }

  public addRecord(record: Record) {
    this.records.push(record)
    this.calcTotal()
  }

  private calcTotal() {
    const tmp = this.records.reduce((sum, item) => sum + (item.value ?? 0), 0)
    this.total = parseFloat(tmp.toFixed(2))
  }
}