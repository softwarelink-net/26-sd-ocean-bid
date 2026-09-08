<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  hint?: string
  accent?: 'ocean' | 'gold' | 'emerald' | 'slate'
}>()

const accentMap = {
  ocean: 'from-ocean-700 to-ocean-500',
  gold: 'from-gold-600 to-gold-400',
  emerald: 'from-emerald-700 to-emerald-500',
  slate: 'from-slate-700 to-slate-500',
}
</script>

<template>
  <div class="card-panel relative overflow-hidden p-5">
    <div
      class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-10"
      :class="accentMap[accent || 'ocean']"
    />
    <p class="text-xs font-medium uppercase tracking-wider text-slate-500">{{ title }}</p>
    <p class="mt-2 font-display text-3xl text-ocean-900">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>
