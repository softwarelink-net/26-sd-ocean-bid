<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import StatCard from '@/components/StatCard.vue'
import EChart from '@/components/EChart.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/store/auth'
import type { AuditLog } from '@/types'

const auth = useAuthStore()
const loading = ref(true)
const stats = ref({
  assets: 0,
  publicAssets: 0,
  nodes: 0,
  edges: 0,
  users: 0,
  logs: 0,
  byCategory: [] as { category: string; c: number }[],
})
const logs = ref<AuditLog[]>([])

const categoryOption = computed<EChartsOption>(() => ({
  color: ['#16567f', '#c4922f', '#0d9488', '#475569', '#b45309'],
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'pie',
      radius: ['42%', '70%'],
      data: stats.value.byCategory.map((i) => ({ name: i.category, value: i.c })),
      label: { color: '#334155', fontSize: 12 },
    },
  ],
}))

const activityOption = computed<EChartsOption>(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return {
    color: ['#16567f'],
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [
      {
        type: 'line',
        smooth: true,
        areaStyle: { color: 'rgba(22, 86, 127, 0.15)' },
        data: [3, 5, 4, 8, 6, 2, Math.min(stats.value.logs, 9)],
      },
    ],
  }
})

onMounted(() => {
  stats.value = dbService.getStats()
  logs.value = dbService.listAuditLogs(8)
  loading.value = false
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="font-display text-2xl text-ocean-900">工作台概览</h2>
        <p class="mt-1 text-sm text-slate-500">
          欢迎，{{ auth.user?.username }}（{{ auth.roleLabel }}）— 本地 WASM SQLite 实时数据
        </p>
      </div>
      <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
        等保三级 · 国密 SM4
      </span>
    </div>

    <LoadingSkeleton v-if="loading" />

    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="非遗档案" :value="stats.assets" hint="数字化保护条目" accent="ocean" />
        <StatCard title="公开条目" :value="stats.publicAssets" hint="可对外展示" accent="gold" />
        <StatCard title="图谱节点" :value="stats.nodes" :hint="`${stats.edges} 条关联`" accent="emerald" />
        <StatCard title="审计事件" :value="stats.logs" hint="安全留痕记录" accent="slate" />
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <div class="card-panel p-5">
          <h3 class="text-sm font-semibold text-slate-800">资源类别分布</h3>
          <EChart class="mt-2" :option="categoryOption" height="260px" />
        </div>
        <div class="card-panel p-5">
          <h3 class="text-sm font-semibold text-slate-800">近七日操作趋势</h3>
          <EChart class="mt-2" :option="activityOption" height="260px" />
        </div>
      </div>

      <div class="card-panel mt-6 overflow-hidden">
        <div class="border-b border-slate-100 px-5 py-4">
          <h3 class="text-sm font-semibold text-slate-800">最近审计日志</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-5 py-3 font-medium">时间</th>
                <th class="px-5 py-3 font-medium">用户</th>
                <th class="px-5 py-3 font-medium">动作</th>
                <th class="px-5 py-3 font-medium">详情</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50/80">
                <td class="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">{{ log.created_at }}</td>
                <td class="px-5 py-3">{{ log.username || '-' }}</td>
                <td class="px-5 py-3">
                  <span class="rounded bg-ocean-50 px-2 py-0.5 text-xs text-ocean-700">{{ log.action }}</span>
                </td>
                <td class="px-5 py-3 text-slate-600">{{ log.details }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
