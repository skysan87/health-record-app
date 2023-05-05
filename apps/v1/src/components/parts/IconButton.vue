<template>
  <div :class="`py-0 px-2 cursor-pointer rounded-full hover:${bgColor}`">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      require: false,
      default: 'bg-gray-200'
    }
  }
}
</script>
