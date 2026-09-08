<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import EChart from '@/components/EChart.vue'

const year = ref(2020)
const mapReady = ref(false)
const useFallback = ref(false)

const markers = [
  { name: '新加坡侨社', value: [103.8, 1.35, 28], year: 1950 },
  { name: '吉隆坡', value: [101.7, 3.15, 18], year: 1965 },
  { name: '曼谷潮籍', value: [100.5, 13.75, 22], year: 1970 },
  { name: '旧金山唐人街', value: [-122.4, 37.8, 15], year: 1880 },
  { name: '温哥华', value: [-123.1, 49.25, 12], year: 1985 },
  { name: '悉尼', value: [151.2, -33.87, 14], year: 1990 },
  { name: '约翰内斯堡', value: [28.05, -26.2, 8], year: 2000 },
  { name: '巴黎13区', value: [2.35, 48.85, 10], year: 1995 },
  { name: '青岛源点', value: [120.38, 36.07, 35], year: 1800 },
  { name: '济南', value: [117.0, 36.65, 20], year: 1850 },
]

const visible = computed(() => markers.filter((m) => m.year <= year.value))

const option = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    formatter: (p: unknown) => {
      const item = p as { name: string; value: number[] }
      return `${item.name}<br/>强度指数: ${item.value[2]}`
    },
  },
  geo: {
    map: 'world',
    roam: true,
    silent: true,
    itemStyle: {
      areaColor: '#134666',
      borderColor: '#3e8ab8',
      borderWidth: 0.6,
    },
    emphasis: { disabled: true },
  },
  series: [
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: visible.value.map((m) => ({ name: m.name, value: m.value })),
      symbolSize: (val: number[]) => Math.max(8, (val[2] || 10) / 2),
      showEffectOn: 'render',
      rippleEffect: { scale: 3, brushType: 'stroke' },
      itemStyle: { color: '#c4922f', shadowBlur: 8, shadowColor: 'rgba(196,146,47,0.5)' },
      label: {
        show: true,
        formatter: '{b}',
        position: 'right',
        color: '#e2e8f0',
        fontSize: 10,
      },
    },
  ],
}))

const fallbackOption = computed<EChartsOption>(() => ({
  backgroundColor: '#0c2438',
  tooltip: { trigger: 'item' },
  xAxis: { type: 'value', min: -180, max: 180, show: false },
  yAxis: { type: 'value', min: -90, max: 90, show: false },
  grid: { left: 20, right: 20, top: 20, bottom: 20 },
  series: [
    {
      type: 'effectScatter',
      data: visible.value.map((m) => ({
        name: m.name,
        value: [m.value[0], m.value[1], m.value[2]],
      })),
      symbolSize: (val: number[]) => Math.max(10, (val[2] || 10) / 1.8),
      rippleEffect: { scale: 2.5 },
      itemStyle: { color: '#c4922f' },
      label: { show: true, formatter: '{b}', position: 'right', color: '#cbd5e1', fontSize: 11 },
    },
  ],
}))

onMounted(async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json')
    if (!res.ok) throw new Error('map fetch failed')
    const worldJson = await res.json()
    echarts.registerMap('world', worldJson)
    mapReady.value = true
  } catch {
    useFallback.value = true
    mapReady.value = true
  }
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 class="font-display text-2xl text-ocean-900">全球交互展示</h2>
        <p class="mt-1 text-sm text-slate-500">海外非遗分布动态标记 · 时间轴回溯历史变迁</p>
      </div>
      <div class="card-panel flex items-center gap-4 px-4 py-3">
        <span class="text-xs font-medium text-slate-500">时间轴</span>
        <input v-model.number="year" type="range" min="1800" max="2026" step="5" class="w-40 accent-ocean-600 sm:w-56" />
        <span class="font-mono text-sm text-ocean-800">{{ year }}</span>
      </div>
    </div>

    <div class="card-panel overflow-hidden bg-ocean-900 p-2">
      <EChart
        v-if="mapReady"
        :option="useFallback ? fallbackOption : option"
        height="520px"
      />
      <div v-else class="flex h-[520px] items-center justify-center text-slate-400">加载地球底图…</div>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div
        v-for="m in visible"
        :key="m.name"
        class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
      >
        <p class="font-medium text-ocean-800">{{ m.name }}</p>
        <p class="mt-0.5 text-slate-500">自 {{ m.year }} · 强度 {{ m.value[2] }}</p>
      </div>
    </div>
  </div>
</template>
