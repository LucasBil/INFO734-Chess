<script setup>
  import HeaderComponent from './components/HeaderComponent.vue'
  import FooterComponent from '@/components/FooterComponent.vue'
  import { RouterView } from 'vue-router'
</script>

<template>
  <HeaderComponent />
  <main class="grow flex flex-col">
    <RouterView />
  </main>
  <FooterComponent />
</template>