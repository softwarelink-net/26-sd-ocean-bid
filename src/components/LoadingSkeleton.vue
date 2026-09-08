<script setup lang="ts">
defineProps<{
  show?: boolean
  rows?: number
}>()
</script>

<template>
  <div v-if="show !== false" class="space-y-3 animate-pulse">
    <div
      v-for="i in rows || 4"
      :key="i"
      class="h-12 rounded-md bg-slate-200/80"
      :style="{ width: `${70 + (i % 3) * 10}%` }"
    />
  </div>
</template>
