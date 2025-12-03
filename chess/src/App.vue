<script setup>
  import HeaderComponent from './components/HeaderComponent.vue'
  import FooterComponent from '@/components/FooterComponent.vue'
  import { RouterView, useRoute } from 'vue-router'

  const route = useRoute();

  fetch('http://localhost:3000/games/')
    .then(response => response.json())
    .then(data => {
      console.log('API Health Check:', data);
    })
    .catch(error => {
      console.error('Error fetching API health status:', error);
    });
</script>

<template>
  <HeaderComponent />
  <main class="grow flex flex-col">
    <RouterView />
  </main>
  <FooterComponent v-if="route.name !== 'game'" />
</template>