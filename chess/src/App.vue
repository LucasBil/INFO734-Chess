<script setup>
  import HeaderComponent from './components/HeaderComponent.vue'
  import FooterComponent from '@/components/FooterComponent.vue'
  import { RouterView, useRoute } from 'vue-router'

  const route = useRoute();
</script>

<template>
  <HeaderComponent />
  <main class="grow flex flex-col bg-[#1A1818]">
    <RouterView />
  </main>
  <FooterComponent v-if="route.name !== 'game'" />
</template>