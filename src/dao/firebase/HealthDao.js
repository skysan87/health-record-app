import { collection, getDoc, setDoc, doc, runTransaction, serverTimestamp } from 'firebase/firestore/lite'
import { firestore } from '@/plugins/firebase'
import { Health } from '@/model/Health'
import { Healthlist } from '@/model/Healthlist'
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
}
