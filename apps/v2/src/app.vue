<script setup lang="ts">
provide('activity', useActivityStore())
provide('health', useHealthStore())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
