<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import TimeControlMenu from './TimeControlMenu.vue';

  const router = useRouter();
  let button = ref(null)
  const showMenu = ref(false);

  function openMenu() {
    showMenu.value = true;
  }

  function startGame(timeControl) {
    showMenu.value = false;
    router.push({ 
        name: 'bot-game', 
        params: { level: 1 },
        state: { 
            time: timeControl.time,
            increment: timeControl.increment 
        }
    });
  }
</script>

<template>
    <button ref="button" @click="openMenu" class="btn">Join Bot Game</button>
    <Teleport to="body">
        <TimeControlMenu 
            v-if="showMenu" 
            @close="showMenu = false" 
            @select="startGame" 
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