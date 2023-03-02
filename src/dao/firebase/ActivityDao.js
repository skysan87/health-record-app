import { collection, getDoc, setDoc, doc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore/lite'
import { firestore } from '@/plugins/firebase'
import { Activity } from '@/model/Activity'
import { Activitylist } from '@/model/Activitylist'
import { ActivityDaoBase } from '@/dao/base/ActivityDaoBase'

const activityRef = collection(firestore, 'activity')

export class ActivityDao extends ActivityDaoBase {
  async getList (userId) {
    const docSnapshot = await getDoc(doc(activityRef, userId))
    return docSnapshot.exists()
      ? new Activitylist(userId, docSnapshot.data())
      : null
  }

  async createList (userId) {
    const list = new Activitylist(userId, {})
    list.createdAt = serverTimestamp()
    list.updatedAt = serverTimestamp()

    await setDoc(doc(activityRef, userId), list.getData())

    return list
  }

  async updateList (activitylist) {
    await updateDoc(doc(activityRef, activitylist.id), {
      menu: activitylist.menu,
      updatedAt: serverTimestamp()
    })
  }

  async getActivity (userId, dateString) {
    const docRef = doc(activityRef, userId, 'records', dateString)
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()) {
      return new Activity(dateString, docSnapshot.data())
    }

    const item = new Activity(dateString, {})
    item.createdAt = serverTimestamp()
    item.updatedAt = serverTimestamp()

    await setDoc(docRef, item.getData())

    return item
  }

  async addRecord (params, userId, dateString) {
    const docRef = doc(activityRef, userId, 'records', dateString)
    const docSnapshot = await getDoc(docRef)
    const item = new Activity(dateString, docSnapshot.data())
    item.addRecord(params)

    await updateDoc(docRef, {
      total: item.total,
      records: arrayUnion(params),
      updatedAt: serverTimestamp()
    })

    return item
  }
}
