<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container max-w-sm">
        <!-- フォーカスアウト防止 -->
        <div tabindex="0" class="dummy" />

        <div class="mx-2">
          <div v-for="(a, index) in menu" :key="index" class="pb-2 flex items-center">
            <div class="flex-1 flex flex-wrap">
              <input v-model="a.label" type="text" class="flex-1 mr-1 activity-input">
              <input
                v-model="a.value"
                type="number"
                step="0.1"
                class="flex-1 mr-1 activity-input"
                placeholder="消費カロリー"
              >
              <input v-model="a.unit" type="text" class="flex-1 mr-1 activity-input" placeholder="実施単位">
            </div>
            <icon-button @click.stop.native="deleteData(index)">
              <fa title="削除" :icon="['fas', 'trash-can']" size="xs" />
            </icon-button>
          </div>
          <button class="btn btn-regular" @click="add">
            追加
          </button>
        </div>

        <div class="flex flex-row-reverse mx-2">
          <button ref="okBtn" class="btn btn-regular mx-1" @click="update">
            OK
          </button>
          <button class="btn btn-outline mx-1" @click="cancel">
            Cancel
          </button>
        </div>

        <!-- フォーカスアウト防止 -->
        <div tabindex="0" class="dummy" />
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/parts/IconButton'
import { fixFloat } from '@/util/NumberUtil'

export default {
  name: 'ActivityDialog',

  components: {
    IconButton
  },

  props: {
    parent: {
      type: Element,
      require: true,
      default: null
    },
    target: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data () {
    return {
      menu: this.target.map(item => ({ ...item })) // deep copy
    }
  },
  mounted () {
    this.parent.appendChild(this.$el)
    this.$nextTick(() => {
      this.$el.focus()
      this.init()
      document.addEventListener('focusin', this.checkFocus, false)
    })
  },
  destroyed () {
    document.removeEventListener('focusin', this.checkFocus, false)
    this.$el.remove()
  },
  methods: {
    init () {
      this.focusFirst()
    },
    update () {
      const formatted = this.menu
        .filter(a => a.label !== null && a.label !== '')
        .map((a) => {
          return {
            label: a.label.trim(),
            value: fixFloat(a.value, 1),
            unit: a.unit ? a.unit?.trim() : ''
          }
        })
      this.$emit('update', formatted)
      this.$destroy()
    },
    cancel () {
      this.$destroy()
    },
    checkFocus (ev) {
      if (ev.target !== null && ev.target.className === 'dummy') {
        this.focusFirst()
      }
    },
    focusFirst () {
      const targetInput = this.$el.querySelector('input')
      if (targetInput) {
        targetInput.focus()
      } else {
        this.$refs.okBtn.focus()
      }
    },
    deleteData (index) {
      this.menu.splice(index, 1)
    },
    add () {
      this.menu.push({
        label: null,
        value: null,
        unit: null
      })
    }
  }
}
</script>

<style scoped>
.activity-input {
  @apply block border border-black py-1 px-2 bg-gray-200;
}
</style>
