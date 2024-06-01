export class InMemoryStorage {

  private static memory = new Map<String, Array<any>>()

  public static async get(table: string): Promise<Array<any>> {
    const rows = InMemoryStorage.memory.get(table) ?? []
    return structuredClone(rows)
  }

  public static async upsert(table: string, data: any | Array<any>) {
    const dataList = Array.isArray(data) ? data : [data]

    if (!InMemoryStorage.memory.has(table)) {
      InMemoryStorage.memory.set(table, dataList)
      return
    }
    const rows = await this.get(table)
    dataList.forEach(data => {
      const index = rows.findIndex(item => item['id'] === data.id)
      if (index < 0) {
        rows.push(data)
      } else {
        const clone = {
          ...rows[index],
          ...data
        }
        rows[index] = clone
      }
    })
    InMemoryStorage.memory.set(table, rows)
  }

  public static async create(table: string, data: any): Promise<void> {
    if (!InMemoryStorage.memory.has(table)) {
      InMemoryStorage.memory.set(table, [data])
      return
    }
    const rows = await this.get(table)
    rows.push(data)
    InMemoryStorage.memory.set(table, rows)
  }

  public static async update(table: string, data: any, id: any): Promise<void> {
    const rows = await this.get(table)
    const index = rows.findIndex(item => item['id'] === id)
    if (index < 0) {
      return
    }
    const clone = {
      ...rows[index],
      ...data
    }
    rows[index] = clone
    InMemoryStorage.memory.set(table, rows)
  }

  public static async delete(table: string, id: any): Promise<void> {
    const rows = await this.get(table)
    const index = rows.findIndex(item => item['id'] === id)
    if (index < 0) {
      return
    }
    rows.splice(index, 1)
    InMemoryStorage.memory.set(table, rows)
  }

  public static clear(): void {
    // for unit-test
    InMemoryStorage.memory.clear()
  }
}