<script setup>
    import { Motion } from 'motion-v';
    import { onMounted, defineEmits, ref } from 'vue';

    const props = defineProps({
        player_1: {
            type: Object,
            required: true,
        },
        player_2: {
            type: Object,
            required: false,
        },
        icons: {
            type: Array,
            default: () => [
            '🔥', '⚡', '💀', '🎯', '👑', '🧠', '💥', '🎮', '🐉', '🚀'
            ]
        }
    });

    const stopScroll = ref(false)

    const emit = defineEmits(['animation-end']);

    onMounted(() => {
        setTimeout(() => stopScroll.value = true, 1000)
        setTimeout(() => { emit('animation-end'); }, 2500);
    });
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="absolute inset-0 flex items-center bg-base-100 justify-center bg-opacity-90 z-50 overflow-hidden">
      <!-- Player gauche -->
      <Motion
        :initial="{ x: '-100vw', opacity: 0 }"
        :animate="{ x: 0, opacity: 1 }"
        :transition="{ duration: 0.8, ease: 'easeOut' }"
        class="text-white text-3xl flex flex-col items-center"
      >
        <img :src="player_1.avatar" class="w-24 h-24 rounded-full border-4 border-white" />
        <p class="mt-2 font-bold">{{ player_1.profilename }}</p>
      </Motion>

      <!-- VS -->
      <Motion
        :initial="{ scale: 0, opacity: 0 }"
        :animate="{ scale: 1.2, opacity: 1 }"
        :transition="{ delay: 0.6, duration: 0.6 }"
        class="text-6xl mx-10 font-extrabold"
      >
        VS
      </Motion>

      <!-- Player droite -->
      <Motion
        :initial="{ x: '100vw', opacity: 0 }"
        :animate="{ x: 0, opacity: 1 }"
        :transition="{ duration: 0.8, ease: 'easeOut' }"
        class="text-white text-3xl flex flex-col items-center"
      >
        <img :src="player_2.avatar" class="w-24 h-24 rounded-full border-4 border-white" />
        <p class="mt-2 font-bold">{{ player_2.profilename }}</p>
      </Motion>
    </div>
  </transition>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.8s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    }
</style>