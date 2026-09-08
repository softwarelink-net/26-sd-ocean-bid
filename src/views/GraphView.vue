<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import EChart from '@/components/EChart.vue'
import { dbService } from '@/db/service'

const loading = ref(true)
const graph = ref(dbService.getGraph())

onMounted(() => {
  graph.value = dbService.getGraph()
  loading.value = false
})

const typeColor: Record<string, string> = {
  Person: '#c4922f',
  Artwork: '#16567f',
  Location: '#0d9488',
  Event: '#7c3aed',
}

const option = computed<EChartsOption>(() => {
  const { nodes, edges } = graph.value
  return {
    tooltip: {},
    legend: [
      {
        data: ['Person', 'Artwork', 'Location'],
        bottom: 0,
        textStyle: { color: '#64748b' },
      },
    ],
    series: [
      {
        type: 'graph',
        layout: 'force',
        roam: true,
        draggable: true,
        label: { show: true, position: 'right', fontSize: 11, color: '#0f172a' },
        force: { repulsion: 180, edgeLength: [60, 140] },
        categories: [{ name: 'Person' }, { name: 'Artwork' }, { name: 'Location' }],
        data: nodes.map((n) => ({
          id: String(n.id),
          name: n.label,
          category: n.type || 'Artwork',
          symbolSize: n.type === 'Location' ? 42 : n.type === 'Person' ? 36 : 48,
          itemStyle: { color: typeColor[n.type || 'Artwork'] || '#475569' },
        })),
        links: edges.map((e) => ({
          source: String(e.source_id),
          target: String(e.target_id),
          label: { show: true, formatter: e.relation, fontSize: 10, color: '#94a3b8' },
          lineStyle: { color: '#94a3b8', curveness: 0.15 },
        })),
        lineStyle: { opacity: 0.7, width: 1.5 },
        emphasis: { focus: 'adjacency' },
      },
    ],
  }
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="font-display text-2xl text-ocean-900">侨乡知识图谱</h2>
      <p class="mt-1 text-sm text-slate-500">
        基于 Neo4j 逻辑模型的前端模拟 · 传承脉络 / 地域分布 / 华侨关联
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-4">
      <div class="card-panel space-y-3 p-5 lg:col-span-1">
        <h3 class="text-sm font-semibold text-slate-800">图统计</h3>
        <div class="rounded-md bg-ocean-50 px-3 py-2 text-sm">
          <span class="text-slate-500">节点</span>
          <span class="ml-2 font-display text-lg text-ocean-800">{{ graph.nodes.length }}</span>
        </div>
        <div class="rounded-md bg-gold-400/10 px-3 py-2 text-sm">
          <span class="text-slate-500">关系</span>
          <span class="ml-2 font-display text-lg text-gold-600">{{ graph.edges.length }}</span>
        </div>
        <ul class="mt-4 space-y-2 text-xs text-slate-600">
          <li class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-gold-500" /> Person 传承人</li>
          <li class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-ocean-600" /> Artwork 非遗项目</li>
          <li class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-teal-600" /> Location 地域</li>
        </ul>
        <p class="pt-2 text-[11px] leading-relaxed text-slate-400">
          可拖拽节点、滚轮缩放；关系含 creator_of / inherits / diaspora_link 等。
        </p>
      </div>

      <div class="card-panel p-3 lg:col-span-3">
        <EChart v-if="!loading" :option="option" height="520px" />
      </div>
    </div>
  </div>
</template>
