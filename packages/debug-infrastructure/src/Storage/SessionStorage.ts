export class SessionStorage {

  public static async get(table: string): Promise<Array<any>> {
    const jsonStr = sessionStorage.getItem(table)
    return !jsonStr ? [] : JSON.parse(jsonStr)
  }

  public static async upsert(table: string, data: any | Array<any>) {
    const dataList = Array.isArray(data) ? data : [data]

    if (!sessionStorage.getItem(table)) {
      sessionStorage.setItem(table, JSON.stringify(dataList))
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
    sessionStorage.setItem(table, JSON.stringify(rows))
  }

  public static async create(table: string, data: any): Promise<void> {
    if (!sessionStorage.getItem(table)) {
      sessionStorage.setItem(table, JSON.stringify([data]))
      return
    }
    const rows = await this.get(table)
    rows.push(data)
    sessionStorage.setItem(table, JSON.stringify(rows))
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
    sessionStorage.setItem(table, JSON.stringify(rows))
  }

  public static async delete(table: string, id: any): Promise<void> {
    const rows = await this.get(table)
    const index = rows.findIndex(item => item['id'] === id)
    if (index < 0) {
      return
    }
    rows.splice(index, 1)
    sessionStorage.setItem(table, JSON.stringify(rows))
  }
}