<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-[calc(100vh-2.5rem)] bg-slate-50">
    <header class="border-b border-slate-200 bg-ocean-950 text-white">
      <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p class="font-mono text-xs tracking-wider text-gold-400">SDGP370000000202602003893</p>
        <h1 class="mt-3 font-display text-2xl leading-snug sm:text-3xl">
          华侨非物质文化遗产数字管理系统竞争性磋商公告
        </h1>
        <p class="mt-3 text-sm text-slate-300">
          项目发包方：中共山东省委统战部融媒体中心 · 发布时间：2026-09-03
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <RouterLink to="/login" class="btn-primary bg-gold-500 hover:bg-gold-400 text-ocean-950">
            进入演示系统
          </RouterLink>
          <a
            href="https://github.com/softwarelink-net/26-sd-ocean-bid"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            查看源码
          </a>
        </div>
      </div>
    </header>

    <article class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <section class="card-panel p-6 sm:p-8">
        <h2 class="font-display text-xl text-ocean-900">项目摘要</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          受中共山东省委统战部融媒体中心委托，天勤工程咨询有限公司对华侨非物质文化遗产数字管理系统组织竞争性磋商，预算总金额
          <strong class="text-ocean-800">1,370,000.00 元</strong>，包括软件开发、测试评估认证及监理服务。
        </p>
        <dl class="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">项目编号</dt>
            <dd class="mt-1 font-mono text-ocean-800">SDGP370000000202602003893</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">关键词</dt>
            <dd class="mt-1 text-slate-700">华侨非遗, 数字管理系统, 政府采购, 软件开发, 等保密评, 统战文化</dd>
          </div>
        </dl>
      </section>

      <section class="card-panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-xl text-ocean-900">技术要点</h2>
        <ul class="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>非遗数据采集与多模态资产管理（视频、音频、3D、文档）</li>
          <li>侨乡知识图谱构建与可视化关联挖掘</li>
          <li>国密算法安全加固与等保三级合规设计</li>
          <li>前后端分离架构，WebGL/3D 展示非遗实物</li>
        </ul>
      </section>

      <section class="card-panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-xl text-ocean-900">技术创新性</h2>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">
          采用前后端分离架构，引入 WebGL/3D 技术展示非遗实物，利用知识图谱关联海外华侨文化脉络，实现数据的深度挖掘与可视化呈现。
        </p>
      </section>

      <section class="card-panel mt-6 p-6 sm:p-8">
        <h2 class="font-display text-xl text-ocean-900">免责声明</h2>
        <ol class="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-600">
          <li>
            <strong>数据来源与合规性</strong>：本项目所涉数据信息均采集自互联网公开渠道发布的标讯公示信息。项目开发者严格遵守《中华人民共和国数据安全法》及相关法律法规，确保数据来源合法、公开、可查询。
          </li>
          <li>
            <strong>技术实现路径</strong>：本项目核心内容系基于国产大语言模型进行算法推演与自动化构造生成，非直接引用或复制原始招标文件。
          </li>
          <li>
            <strong>保密承诺</strong>：本项目郑重承诺：不涉及、不包含任何国家秘密、商业秘密或未公开的敏感信息。所有生成内容均基于公开数据的逻辑推演。
          </li>
          <li>
            <strong>知识产权与巧合声明</strong>：鉴于本项目内容均由AI模型基于公开数据推演生成，若生成内容在表述方式、结构逻辑上与任何第三方原始标书文件存在相似之处，纯属技术通用设计之巧合，不构成对任何第三方著作权的侵犯或商业秘密的泄露。本项目不保证生成内容的准确性与完整性，仅供技术研究与学习参考。
          </li>
          <li>
            <strong>免责条款</strong>：任何单位或个人使用本项目代码及生成内容所产生的一切后果，均由使用者自行承担，项目开发者不承担任何法律责任。
          </li>
        </ol>
      </section>
    </article>
  </div>
</template>
