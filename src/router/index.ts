import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { public: true, title: '登录' },
      },
    ],
  },
  {
    path: '/tender',
    name: 'tender',
    component: () => import('@/views/TenderView.vue'),
    meta: { public: true, title: '竞争性磋商公告' },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: '工作台', roles: ['admin', 'manager', 'operator', 'public'] },
      },
      {
        path: 'assets',
        name: 'assets',
        component: () => import('@/views/AssetsView.vue'),
        meta: { title: '非遗资源中枢', roles: ['admin', 'manager', 'operator', 'public'] },
      },
      {
        path: 'assets/:id',
        name: 'asset-detail',
        component: () => import('@/views/AssetDetailView.vue'),
        meta: { title: '档案详情', roles: ['admin', 'manager', 'operator', 'public'] },
      },
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/views/GraphView.vue'),
        meta: { title: '侨乡知识图谱', roles: ['admin', 'manager', 'operator', 'public'] },
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/MapView.vue'),
        meta: { title: '全球交互展示', roles: ['admin', 'manager', 'operator', 'public'] },
      },
      {
        path: 'security',
        name: 'security',
        component: () => import('@/views/SecurityView.vue'),
        meta: { title: '安全合规控制台', roles: ['admin', 'manager'] },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: '系统设置', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')
  const publicPaths = ['/login', '/tender']
  const isPublic = to.meta.public === true || publicPaths.includes(to.path)

  if (!token && !isPublic) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (token && to.path === '/login') {
    next('/dashboard')
    return
  }

  const rawUser = localStorage.getItem('auth_user')
  if (token && rawUser && to.meta.roles) {
    try {
      const user = JSON.parse(rawUser) as { role: string }
      const roles = to.meta.roles as string[]
      if (!roles.includes(user.role)) {
        next('/dashboard')
        return
      }
    } catch {
      next('/login')
      return
    }
  }

  next()
})

export default router
