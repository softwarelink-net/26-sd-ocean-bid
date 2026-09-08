<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import EChart from '@/components/EChart.vue'
import StatCard from '@/components/StatCard.vue'
import { dbService } from '@/db/service'
import type { AuditLog, SystemConfig } from '@/types'

const configs = ref<SystemConfig[]>([])
const logs = ref<AuditLog[]>([])

onMounted(() => {
  configs.value = dbService.getConfigs()
  logs.value = dbService.listAuditLogs(12)
})

const configMap = computed(() =>
  Object.fromEntries(configs.value.map((c) => [c.key, c.value])) as Record<string, string>,
)

const healthOption = computed<EChartsOption>(() => ({
  radar: {
    indicator: [
      { name: '等保进度', max: 100 },
      { name: '国密加密', max: 100 },
      { name: '敏感词过滤', max: 100 },
      { name: '数据备份', max: 100 },
      { name: '系统健康', max: 100 },
    ],
    axisName: { color: '#64748b', fontSize: 11 },
    splitArea: { areaStyle: { color: ['#f8fafc', '#f1f5f9'] } },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [82, 95, 88, 91, 94],
          name: '合规健康度',
          areaStyle: { color: 'rgba(22, 86, 127, 0.25)' },
          lineStyle: { color: '#16567f' },
          itemStyle: { color: '#c4922f' },
        },
      ],
    },
  ],
}))

const filterLogs = [
  { time: '2026-09-07 14:22', word: '***', action: '拦截并脱敏', channel: '留言板' },
  { time: '2026-09-06 09:11', word: '***', action: '替换为安全词', channel: '档案描述' },
  { time: '2026-09-05 18:40', word: '***', action: '人工复核', channel: '评论审核' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="font-display text-2xl text-ocean-900">安全合规控制台</h2>
      <p class="mt-1 text-sm text-slate-500">等保测评 · 国密算法 · 敏感词过滤 · 备份与健康度监控</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="等保级别" :value="configMap.security_level || 'Level-3'" hint="三级等保设计" accent="ocean" />
      <StatCard title="加密算法" :value="configMap.encryption || 'SM4'" hint="国密算法启用" accent="gold" />
      <StatCard title="备份状态" :value="configMap.backup_status || 'healthy'" hint="最近一次全量备份" accent="emerald" />
      <StatCard title="敏感词过滤" :value="configMap.ml_filter || 'enabled'" hint="内容安全策略" accent="slate" />
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="card-panel p-5">
        <h3 class="text-sm font-semibold text-slate-800">系统合规健康度雷达</h3>
        <EChart class="mt-2" :option="healthOption" height="300px" />
      </div>

      <div class="card-panel overflow-hidden">
        <div class="border-b border-slate-100 px-5 py-4">
          <h3 class="text-sm font-semibold text-slate-800">敏感词过滤日志</h3>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-for="(f, i) in filterLogs" :key="i" class="flex items-start justify-between gap-3 px-5 py-3 text-sm">
            <div>
              <p class="font-medium text-slate-800">{{ f.action }}</p>
              <p class="mt-0.5 text-xs text-slate-500">{{ f.channel }} · 命中脱敏词条</p>
            </div>
            <span class="shrink-0 font-mono text-[11px] text-slate-400">{{ f.time }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card-panel mt-6 overflow-hidden">
      <div class="border-b border-slate-100 px-5 py-4">
        <h3 class="text-sm font-semibold text-slate-800">安全审计流水</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-5 py-3">时间</th>
              <th class="px-5 py-3">用户</th>
              <th class="px-5 py-3">动作</th>
              <th class="px-5 py-3">IP</th>
              <th class="px-5 py-3">详情</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="log in logs" :key="log.id">
              <td class="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">{{ log.created_at }}</td>
              <td class="px-5 py-3">{{ log.username || '-' }}</td>
              <td class="px-5 py-3"><span class="rounded bg-slate-100 px-2 py-0.5 text-xs">{{ log.action }}</span></td>
              <td class="px-5 py-3 font-mono text-xs">{{ log.ip_address }}</td>
              <td class="px-5 py-3 text-slate-600">{{ log.details }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
