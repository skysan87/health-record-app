import { collection, getDoc, setDoc, updateDoc, doc, runTransaction, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { firestore } from '@/plugins/firebase'
import { Health } from '@/model/Health'
import { GoalWeightRange, Healthlist } from '@/model/Healthlist'
import { HealthDaoBase } from '@/dao/base/HealthDaoBase'

const healthRef = collection(firestore, 'health')

export class HealthDao extends HealthDaoBase {
  async getList (userId) {
    const docSnapshot = await getDoc(doc(healthRef, userId))
    return docSnapshot.exists()
      ? new Healthlist(userId, docSnapshot.data())
      : null
  }

  async createList (userId) {
    const list = new Healthlist(userId, {})
    list.createdAt = serverTimestamp()
    list.updatedAt = serverTimestamp()
    await setDoc(doc(healthRef, userId), list.getData())
    return list
  }

  async addAndUpdateLatest (params, userId) {
    const health = new Health('', params)
    health.createdAt = serverTimestamp()
    health.updatedAt = serverTimestamp()

    const rootDocRef = doc(healthRef, userId)
    const SubCollectionRef = collection(firestore, 'health', userId, 'records')
    const newDocRef = doc(SubCollectionRef)
    let latest

    await runTransaction(firestore, async (transaction) => {
      const rootDoc = await transaction.get(rootDocRef)
      if (!rootDoc.exists()) {
        throw new Error('health does not exist.')
      }
      latest = rootDoc.data().latest ?? {}
      latest[health.type] = health.value

      transaction.update(rootDocRef, {
        latest,
        updatedAt: serverTimestamp()
      })

      transaction.set(newDocRef, health.getData())
    })

    return latest
  }

  async updateGoal (goal, userId) {
    await updateDoc(doc(healthRef, userId), {
      goal,
      updatedAt: serverTimestamp()
    })
  }

  async updateGoalWeightRange ({ start, end }, userId) {
    const rootDocRef = doc(healthRef, userId)
    let data = new GoalWeightRange({})

    await runTransaction(firestore, async (transaction) => {
      const healthDoc = await transaction.get(rootDocRef)
      if (!tmpHealthDoc.exists()) {
        throw new Error('health does not exist.')
      }

      const healthlist = healthDoc.data()
      if (!Object.hasOwn(healthlist.goal, Healthlist.GOAL_WEIGHT) ||
        !Object.hasOwn(healthlist.latest, Health.TYPE_WEIGHT)) {
        throw new Error('goal.weight and latest.weight must be set.')
      }

      data = new GoalWeightRange({
        startWeight: healthlist.latest[Health.TYPE_WEIGHT] ?? 0,
        endWeight: healthlist.goal[Healthlist.GOAL_WEIGHT] ?? 0,
        startDate: start,
        endDate: end
      })

      transaction.update(rootDocRef, {
        goalWeightRange: data,
        updatedAt: serverTimestamp()
      })
    })
    return data
  }

  /**
   * レコードを取得
   * @param {String} userId
   * @returns {[{ x: Date, y: Number }]}
   */
  async getRecords (userId) {
    // NOTE: where句がある場合、indexが必要になるため全て取得する
    const q = query(collection(firestore, 'health', userId, 'records')
      , orderBy('createdAt', 'desc')
      , limit(100)
    )

    const querySnapshot = await getDocs(q)
    const result = []
    querySnapshot.docs.forEach((doc) => {
      const health = HealthDao.convertToHealth(doc.data())
      if (health.type === Health.TYPE_WEIGHT) {
        result.push({ x: health.createdAt, y: health.value })
      }
    })

    return result.reverse()
  }

  /**
   * @param {firestore.DocumentData} data
   * @returns {Health}
   */
  static convertToHealth (data) {
    const health = new Health(doc.id, data)
    // timestampをDateに変換
    health.createdAt = data.createdAt ? data.createdAt.toDate() : ''
    health.updatedAt = data.updatedAt ? data.updatedAt.toDate() : ''
    return health
  }
}
