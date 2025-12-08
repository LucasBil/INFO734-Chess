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

<style scoped>

.btn {
  background-color: #AB2BFF;
  border: 1px solid white;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  transition: all 0.3s;
}
</style>