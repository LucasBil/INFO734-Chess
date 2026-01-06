<script setup>
  import { onMounted, watch, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSocketStore } from '@/stores/socket';
  import { useProfileStore } from '@/stores/profile';
  import TimeControlMenu from './TimeControlMenu.vue';

  const router = useRouter();
  const profileStore = useProfileStore();
  const socketStore = useSocketStore();
  let button = ref(null)
  const showMenu = ref(false);
  let selectedTimeControl = null;
  
  onMounted(() => {
    button.value.disabled = profileStore.profile ? false : true; 
    if (profileStore.profile)
      socketStore.connect(profileStore.profile);
  })

  function openMenu() {
    showMenu.value = true;
  }

  function matchmaking(timeControl) {
    selectedTimeControl = timeControl;
    showMenu.value = false;
    button.value.disabled = true;
    button.value.textContent = "Waiting ..."
    socketStore.findGame(timeControl);
  }

  watch(() =>
    socketStore.roomId, (newRoom) => {
      const state = {};
      if (selectedTimeControl) {
        state.time = selectedTimeControl.time;
        state.increment = selectedTimeControl.increment;
      }
      router.push({ name: 'game', params: { id: newRoom }, query: { online: true }, state });
    }
  );
</script>

<template>
    <button ref="button" @click="openMenu" class="btn">Join Online Game</button>
    <Teleport to="body">
        <TimeControlMenu 
            v-if="showMenu" 
            @close="showMenu = false"
            @select="matchmaking"
        />
    </Teleport>
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