// @ts-ignore
import config from './config/app.config.js'
import { getApps, getApp, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseApp = !getApps().length ? initializeApp(config) : getApp()

export const firestore = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp)

// TODO: 非推奨対応
// オフラインデータ利用有効化(複数タブ無効)
// enableIndexedDbPersistence(firestore, { forceOwnership: true })
//   .catch((err) => {
//     if (err.code === 'failed-precondition') {
//       console.error('複数タブ表示によるエラー')
//     } else if (err.code === 'unimplemented') {
//       console.error('未サポートブラウザ')
//     } else {
//       console.error(err)
//     }
//   })