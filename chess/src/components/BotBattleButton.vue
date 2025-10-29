<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  let button = ref(null)

  function matchmaking() {
    router.push({ name: 'bot-game', params: { level: 1 }});
  }
</script>

<template>
    <button ref="button" @click="matchmaking" class="btn">Join Bot Game</button>
</template>