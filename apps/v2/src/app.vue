<script setup lang="ts">
provide('activity', useActivityRecord())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
