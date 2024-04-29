<script setup lang="ts">
provide('activity', useActivityStore())
provide('health', useHealthStore())
</script>

<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
