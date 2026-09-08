<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { dbService } from '@/db/service'
import { useAuthStore } from '@/store/auth'
import type { Asset } from '@/types'

const auth = useAuthStore()
const keyword = ref('')
const category = ref('')
const page = ref(1)
const pageSize = 8
const modalOpen = ref(false)
const editing = ref<Asset | null>(null)

const form = reactive({
  title: '',
  category: 'Craft',
  region: '',
  inheritor: '',
  description: '',
  is_public: true,
})

const canCreate = computed(() => auth.role === 'admin' || auth.role === 'manager' || auth.role === 'operator')

const queryOpts = computed(() => {
  const role = auth.role
  return {
    keyword: keyword.value,
    category: category.value,
    page: page.value,
    pageSize,
    onlyPublic: role === 'public',
    createdBy: role === 'operator' ? auth.user?.id : undefined,
  }
})

const result = ref(dbService.listAssets(queryOpts.value))

function refresh() {
  result.value = dbService.listAssets(queryOpts.value)
}

watch([keyword, category, page], refresh)

const totalPages = computed(() => Math.max(1, Math.ceil(result.value.total / pageSize)))

const categories = ['', 'Craft', 'Performance', 'Ritual', 'Artifact']

function openCreate() {
  editing.value = null
  Object.assign(form, {
    title: '',
    category: 'Craft',
    region: '',
    inheritor: '',
    description: '',
    is_public: true,
  })
  modalOpen.value = true
}

function openEdit(asset: Asset) {
  if (!auth.user || !dbService.canEditAsset(auth.role!, auth.user.id, asset)) return
  editing.value = asset
  Object.assign(form, {
    title: asset.title,
    category: asset.category || 'Craft',
    region: asset.region || '',
    inheritor: asset.inheritor || '',
    description: asset.description || '',
    is_public: !!asset.is_public,
  })
  modalOpen.value = true
}

function save() {
  if (!auth.user || !form.title.trim()) return
  if (editing.value) {
    dbService.updateAsset(
      editing.value.id,
      {
        title: form.title,
        category: form.category,
        region: form.region,
        inheritor: form.inheritor,
        description: form.description,
        is_public: form.is_public ? 1 : 0,
      },
      auth.user.id,
    )
  } else {
    dbService.createAsset(
      {
        title: form.title,
        category: form.category,
        region: form.region,
        inheritor: form.inheritor,
        description: form.description,
        media_url: null,
        is_public: form.is_public ? 1 : 0,
        created_by: auth.user.id,
      },
      auth.user.id,
    )
  }
  modalOpen.value = false
  refresh()
}

function remove(asset: Asset) {
  if (!auth.user || !dbService.canEditAsset(auth.role!, auth.user.id, asset)) return
  if (!confirm(`确认删除「${asset.title}」？`)) return
  dbService.deleteAsset(asset.id, auth.user.id)
  refresh()
}

const categoryLabel: Record<string, string> = {
  Craft: '传统技艺',
  Performance: '表演艺术',
  Ritual: '民俗礼仪',
  Artifact: '文物遗存',
}
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="font-display text-2xl text-ocean-900">非遗资源中枢</h2>
        <p class="mt-1 text-sm text-slate-500">多格式资产归档 · 元数据管理 · 版本留痕模拟</p>
      </div>
      <button v-if="canCreate" type="button" class="btn-primary gap-1.5" @click="openCreate">
        <PlusIcon class="h-4 w-4" />
        新建档案
      </button>
    </div>

    <div class="card-panel mb-4 flex flex-wrap gap-3 p-4">
      <div class="relative min-w-[200px] flex-1">
        <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input v-model="keyword" class="input-field pl-9" placeholder="搜索名称、传承人、地区…" @input="page = 1" />
      </div>
      <select v-model="category" class="input-field w-auto min-w-[140px]" @change="page = 1">
        <option value="">全部分类</option>
        <option v-for="c in categories.filter(Boolean)" :key="c" :value="c">
          {{ categoryLabel[c] || c }}
        </option>
      </select>
    </div>

    <div class="card-panel overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-3 font-medium">名称</th>
              <th class="px-4 py-3 font-medium">类别</th>
              <th class="px-4 py-3 font-medium">地区</th>
              <th class="px-4 py-3 font-medium">传承人</th>
              <th class="px-4 py-3 font-medium">公开</th>
              <th class="px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in result.items" :key="item.id" class="hover:bg-ocean-50/40">
              <td class="px-4 py-3 font-medium text-ocean-900">
                <RouterLink :to="`/assets/${item.id}`" class="hover:underline">{{ item.title }}</RouterLink>
              </td>
              <td class="px-4 py-3 text-slate-600">{{ categoryLabel[item.category || ''] || item.category }}</td>
              <td class="px-4 py-3 text-slate-600">{{ item.region }}</td>
              <td class="px-4 py-3 text-slate-600">{{ item.inheritor }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="item.is_public ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                >
                  {{ item.is_public ? '是' : '否' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2 text-xs">
                  <RouterLink :to="`/assets/${item.id}`" class="text-ocean-600 hover:underline">查看</RouterLink>
                  <button
                    v-if="auth.user && dbService.canEditAsset(auth.role!, auth.user.id, item)"
                    type="button"
                    class="text-gold-600 hover:underline"
                    @click="openEdit(item)"
                  >
                    编辑
                  </button>
                  <button
                    v-if="auth.role === 'admin' || (auth.role === 'operator' && item.created_by === auth.user?.id)"
                    type="button"
                    class="text-red-600 hover:underline"
                    @click="remove(item)"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!result.items.length">
              <td colspan="6" class="px-4 py-12 text-center text-slate-400">暂无匹配档案</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
        <span>共 {{ result.total }} 条</span>
        <div class="flex gap-2">
          <button type="button" class="btn-secondary py-1" :disabled="page <= 1" @click="page--">上一页</button>
          <span class="px-2 py-1 font-mono text-xs">{{ page }} / {{ totalPages }}</span>
          <button type="button" class="btn-secondary py-1" :disabled="page >= totalPages" @click="page++">下一页</button>
        </div>
      </div>
    </div>

    <TransitionRoot :show="modalOpen" as="template">
      <Dialog class="relative z-[10000]" @close="modalOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-150"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-ocean-950/50" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto p-4">
          <div class="flex min-h-full items-center justify-center">
            <TransitionChild
              as="template"
              enter="ease-out duration-200"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-150"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <DialogTitle class="text-lg font-semibold text-ocean-900">
                  {{ editing ? '编辑档案' : '新建非遗档案' }}
                </DialogTitle>
                <div class="mt-4 space-y-3">
                  <label class="block text-sm">
                    项目名称
                    <input v-model="form.title" class="input-field mt-1" required />
                  </label>
                  <label class="block text-sm">
                    类别
                    <select v-model="form.category" class="input-field mt-1">
                      <option v-for="c in categories.filter(Boolean)" :key="c" :value="c">
                        {{ categoryLabel[c] || c }}
                      </option>
                    </select>
                  </label>
                  <label class="block text-sm">
                    流传地区
                    <input v-model="form.region" class="input-field mt-1" />
                  </label>
                  <label class="block text-sm">
                    传承人
                    <input v-model="form.inheritor" class="input-field mt-1" />
                  </label>
                  <label class="block text-sm">
                    历史渊源 / 描述
                    <textarea v-model="form.description" class="input-field mt-1 min-h-[88px]" rows="3" />
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <input v-model="form.is_public" type="checkbox" class="rounded border-slate-300 text-ocean-600" />
                    公开可见
                  </label>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                  <button type="button" class="btn-secondary" @click="modalOpen = false">取消</button>
                  <button type="button" class="btn-primary" @click="save">保存</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
