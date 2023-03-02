<template>
  <div>
    <div class="flex items-center" @click.left="isExpanded = !isExpanded">
      <fa v-if="isLeftVisible" :icon="['fas', 'caret-down']" :class="{'fa-rotate-180': isExpanded}" class="mr-1" />
      <slot name="title" />
      <fa v-if="isRightVisible" :icon="['fas', 'caret-down']" :class="{'fa-rotate-180': isExpanded}" class="ml-1" />
    </div>
    <div v-show="isExpanded">
      <slot name="component" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    left: {
      type: Boolean,
      require: false,
      default: false
    },

    right: {
      type: Boolean,
      require: false,
      default: false
    }
  },

  data () {
    return {
      isExpanded: false,
      // デフォルトは左ボタン優先
      isLeftVisible: this.left || !this.right,
      isRightVisible: !(this.left || !this.right)
    }
  }
}
</script>
