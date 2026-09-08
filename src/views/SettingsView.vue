<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { dbService } from '@/db/service'
import type { SystemConfig, User } from '@/types'
import { ROLE_LABELS, type UserRole } from '@/types'

const users = ref<User[]>([])
const configs = ref<SystemConfig[]>([])
const message = ref('')

onMounted(() => {
  users.value = dbService.listUsers()
  configs.value = dbService.getConfigs()
})

function resetDb() {
  if (!confirm('将清除浏览器本地库并重新载入种子数据，是否继续？')) return
  dbService.resetDatabase()
  message.value = '本地数据库已重置，请刷新页面重新初始化。'
}

const matrix = [
  { id: 'ROLE_ADMIN', name: '超管', role: 'admin' as UserRole, scope: '全库读写、系统配置、审计' },
  { id: 'ROLE_MANAGER', name: '业务主管', role: 'manager' as UserRole, scope: '内容审核、标签、专家库' },
  { id: 'ROLE_OPERATOR', name: '采集员', role: 'operator' as UserRole, scope: '仅本人创建/负责数据' },
  { id: 'ROLE_PUBLIC', name: '公众/决策', role: 'public' as UserRole, scope: '只读公开数据' },
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="font-display text-2xl text-ocean-900">系统设置</h2>
      <p class="mt-1 text-sm text-slate-500">账号总览 · RBAC 矩阵 · 特征开关 · 本地库维护</p>
    </div>

    <div v-if="message" class="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      {{ message }}
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card-panel overflow-hidden">
        <div class="border-b border-slate-100 px-5 py-4">
          <h3 class="text-sm font-semibold text-slate-800">用户账号</h3>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-for="u in users" :key="u.id" class="flex items-center justify-between px-5 py-3 text-sm">
            <div>
              <p class="font-medium text-ocean-900">{{ u.username }}</p>
              <p class="text-xs text-slate-500">{{ u.email }}</p>
            </div>
            <span class="rounded-full bg-ocean-50 px-2.5 py-1 text-xs text-ocean-700">
              {{ ROLE_LABELS[u.role] }}
            </span>
          </li>
        </ul>
      </div>

      <div class="card-panel overflow-hidden">
        <div class="border-b border-slate-100 px-5 py-4">
          <h3 class="text-sm font-semibold text-slate-800">系统配置 (Feature Flags)</h3>
        </div>
        <ul class="divide-y divide-slate-100">
          <li v-for="c in configs" :key="c.key" class="px-5 py-3 text-sm">
            <div class="flex items-center justify-between gap-3">
              <span class="font-mono text-xs text-slate-500">{{ c.key }}</span>
              <span class="font-medium text-ocean-800">{{ c.value }}</span>
            </div>
            <p class="mt-1 text-xs text-slate-400">{{ c.description }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="card-panel mt-6 overflow-hidden">
      <div class="border-b border-slate-100 px-5 py-4">
        <h3 class="text-sm font-semibold text-slate-800">RBAC 四级权限矩阵</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th class="px-5 py-3">角色 ID</th>
              <th class="px-5 py-3">名称</th>
              <th class="px-5 py-3">数据权限范围</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in matrix" :key="r.id">
              <td class="px-5 py-3 font-mono text-xs text-gold-600">{{ r.id }}</td>
              <td class="px-5 py-3 font-medium">{{ r.name }}</td>
              <td class="px-5 py-3 text-slate-600">{{ r.scope }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card-panel mt-6 p-5">
      <h3 class="text-sm font-semibold text-slate-800">本地数据库维护</h3>
      <p class="mt-1 text-xs text-slate-500">数据持久化于 IndexedDB/localStorage（sql.js 导出字节）。</p>
      <button type="button" class="btn-secondary mt-4 text-red-700 ring-1 ring-red-200" @click="resetDb">
        重置本地数据库
      </button>
    </div>
  </div>
</template>
