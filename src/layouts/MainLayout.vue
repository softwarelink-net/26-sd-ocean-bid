<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  ArchiveBoxIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ShareIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const mobileOpen = ref(false)

const navItems = computed(() => {
  const all = [
    { to: '/dashboard', label: '工作台', icon: ChartBarIcon, roles: ['admin', 'manager', 'operator', 'public'] },
    { to: '/assets', label: '非遗资源中枢', icon: ArchiveBoxIcon, roles: ['admin', 'manager', 'operator', 'public'] },
    { to: '/graph', label: '侨乡知识图谱', icon: ShareIcon, roles: ['admin', 'manager', 'operator', 'public'] },
    { to: '/map', label: '全球交互展示', icon: GlobeAltIcon, roles: ['admin', 'manager', 'operator', 'public'] },
    { to: '/security', label: '安全合规', icon: LockClosedIcon, roles: ['admin', 'manager'] },
    { to: '/settings', label: '系统设置', icon: Cog6ToothIcon, roles: ['admin'] },
  ]
  const role = auth.role
  if (!role) return []
  return all.filter((i) => i.roles.includes(role))
})

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-[calc(100vh-2.5rem)] bg-slate-100">
    <!-- Mobile overlay -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-40 bg-ocean-950/50 lg:hidden"
      @click="mobileOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed left-0 top-10 z-50 flex h-[calc(100vh-2.5rem)] w-64 flex-col border-r border-ocean-800 bg-ocean-900 text-slate-200 transition-transform lg:translate-x-0"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="border-b border-ocean-800 px-5 py-5">
        <p class="font-display text-lg leading-snug text-white">华侨非遗数字管理系统</p>
        <p class="mt-1 font-mono text-[10px] tracking-wider text-gold-400">SDGP370000000202602003893</p>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition"
          :class="
            route.path === item.to || route.path.startsWith(item.to + '/')
              ? 'bg-ocean-700 text-white'
              : 'text-slate-300 hover:bg-ocean-800 hover:text-white'
          "
          @click="mobileOpen = false"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0 opacity-80" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="border-t border-ocean-800 p-4 text-xs text-slate-400">
        <RouterLink to="/tender" class="hover:text-gold-400 transition">查看招标公告</RouterLink>
      </div>
    </aside>

    <!-- Main column -->
    <div class="lg:pl-64">
      <header class="sticky top-10 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            <Bars3Icon v-if="!mobileOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
          <div>
            <h1 class="text-sm font-semibold text-slate-900 sm:text-base">{{ route.meta.title }}</h1>
            <p class="hidden text-xs text-slate-500 sm:block">数字化保护 · 知识图谱 · 安全合规</p>
          </div>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button type="button" class="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title="通知">
            <BellIcon class="h-5 w-5" />
            <span class="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-gold-500" />
          </button>
          <div class="hidden text-right sm:block">
            <p class="text-sm font-medium text-slate-800">{{ auth.user?.username }}</p>
            <p class="text-[11px] text-slate-500">{{ auth.roleLabel }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            @click="logout"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
            退出
          </button>
        </div>
      </header>

      <main class="p-4 sm:p-6">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
