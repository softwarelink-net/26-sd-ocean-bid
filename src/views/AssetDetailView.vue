<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const id = computed(() => Number(route.params.id))
const asset = computed(() => dbService.getAsset(id.value))

const categoryLabel: Record<string, string> = {
  Craft: '传统技艺',
  Performance: '表演艺术',
  Ritual: '民俗礼仪',
  Artifact: '文物遗存',
}

function goBack() {
  router.push('/assets')
}
</script>

<template>
  <div v-if="asset">
    <button type="button" class="mb-4 text-sm text-ocean-600 hover:underline" @click="goBack">← 返回列表</button>

    <div class="grid gap-6 lg:grid-cols-5">
      <div class="card-panel overflow-hidden lg:col-span-2">
        <div
          class="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-ocean-800 to-ocean-600 text-white"
        >
          <div class="p-8 text-center">
            <p class="font-display text-3xl">{{ asset.title }}</p>
            <p class="mt-2 text-sm text-ocean-100">数字化保护档案 · 媒体预览</p>
          </div>
        </div>
        <div class="border-t border-slate-100 p-4 text-xs text-slate-500">
          媒体路径：{{ asset.media_url || '未上传（演示环境使用占位视觉）' }}
        </div>
      </div>

      <div class="card-panel p-6 lg:col-span-3">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="font-display text-2xl text-ocean-900">{{ asset.title }}</h2>
            <p class="mt-1 text-sm text-slate-500">档案编号 #{{ asset.id }} · 创建于 {{ asset.created_at }}</p>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-medium"
            :class="asset.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'"
          >
            {{ asset.is_public ? '公开数据' : '内部数据' }}
          </span>
        </div>

        <dl class="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">类别</dt>
            <dd class="mt-1 text-sm text-slate-800">{{ categoryLabel[asset.category || ''] || asset.category }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">流传地区</dt>
            <dd class="mt-1 text-sm text-slate-800">{{ asset.region || '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">传承人</dt>
            <dd class="mt-1 text-sm text-slate-800">{{ asset.inheritor || '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">录入角色可见性</dt>
            <dd class="mt-1 text-sm text-slate-800">{{ auth.roleLabel }}</dd>
          </div>
        </dl>

        <div class="mt-6">
          <h3 class="text-sm font-semibold text-slate-800">历史渊源</h3>
          <p class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
            {{ asset.description || '暂无描述' }}
          </p>
        </div>

        <div class="mt-8 rounded-lg border border-dashed border-ocean-200 bg-ocean-50/50 p-4 text-xs text-ocean-800">
          <p class="font-medium">版本控制与修订留痕（演示）</p>
          <p class="mt-1 text-ocean-700/80">v1.0 初始建档 → 元数据抽取（EXIF/IPTC 模拟）→ 审核发布流水线</p>
        </div>

        <div class="mt-6">
          <RouterLink to="/graph" class="text-sm text-gold-600 hover:underline">在知识图谱中探索关联 →</RouterLink>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="card-panel p-12 text-center text-slate-500">
    未找到该档案
    <div class="mt-4">
      <button type="button" class="btn-secondary" @click="goBack">返回</button>
    </div>
  </div>
</template>
