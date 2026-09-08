<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-shell relative min-h-[calc(100vh-2.5rem)] overflow-hidden bg-ocean-950">
    <div class="auth-glow pointer-events-none absolute inset-0 opacity-40" />
    <div class="auth-pattern pointer-events-none absolute inset-0 opacity-[0.07]" />
    <div class="relative z-10 flex min-h-[calc(100vh-2.5rem)] items-center justify-center p-6">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.auth-glow {
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(30, 107, 154, 0.45), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(196, 146, 47, 0.18), transparent),
    linear-gradient(160deg, #071621 0%, #0c2438 45%, #123b55 100%);
}

.auth-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>
