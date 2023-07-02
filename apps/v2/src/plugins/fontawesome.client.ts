import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faTrashCan, faCircleNotch, faFloppyDisk, faCaretDown, faSignOutAlt, faSyncAlt, faEdit,
  faArrowLeft, faArrowRight, faHouse
} from '@fortawesome/free-solid-svg-icons'

import { faGoogle } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false

// 利用するアイコンを配列に追加
const solidIcons = [
  faTrashCan, faCircleNotch, faFloppyDisk, faCaretDown, faSignOutAlt, faSyncAlt, faEdit,
  faArrowLeft, faArrowRight, faHouse
]
const bransIcons = [faGoogle]

// 利用するアイコンをlibraryに追加
solidIcons.forEach(icon => library.add(icon))
bransIcons.forEach(icon => library.add(icon))

// グローバルコンポーネントに登録
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('fa', FontAwesomeIcon)
})

// Vue.config.productionTip = false
