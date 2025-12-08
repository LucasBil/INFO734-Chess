<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSocketStore } from '@/stores/socket';
  import { useProfileStore } from '@/stores/profile';

  const router = useRouter();
  const profileStore = useProfileStore();
  const socketStore = useSocketStore();
  let button = ref(null)
  
  onMounted(() => {
    button.value.disabled = profileStore.profile ? false : true; 
    if (profileStore.profile)
      socketStore.connect(profileStore.profile);
  })

  function matchmaking() {
    button.value.disabled = true;
    button.value.textContent = "Waiting ..."
    socketStore.findGame();
  }

  watch(() =>
    socketStore.roomId, (newRoom) => {
      router.push({ name: 'game', params: { id: newRoom }, query: { online: true }});
    }
  );
</script>

<template>
    <button ref="button" @click="matchmaking" class="btn">Join Online Game</button>
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