<script setup lang="ts">
provide('activity', useActivityStore())
provide('health', useHealthStore())
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
