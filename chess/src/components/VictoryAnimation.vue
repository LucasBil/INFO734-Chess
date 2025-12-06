<script setup>
import { Motion } from 'motion-v'
import { defineProps, defineEmits, onMounted } from 'vue'

const props = defineProps({
  winner: {
    type: Object,
    required: true
  },
  reason: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['animation-end'])

onMounted(() => {
  // On émet un signal après 4 secondes quand l’animation est terminée
  setTimeout(() => emit('animation-end'), 4000)
})
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50 overflow-hidden text-white select-none">
    
    <!-- Halo lumineux -->
    <Motion
      :initial="{ scale: 0, opacity: 0 }"
      :animate="{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }"
      :transition="{ duration: 1.2, ease: 'easeOut' }"
      class="rounded-full bg-yellow-400/30 w-72 h-72 blur-3xl absolute"
    />

    <!-- Titre Victoire -->
    <Motion
      :initial="{ y: -200, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, duration: 0.8, ease: 'easeOut' }"
      class="text-6xl font-extrabold text-yellow-400 drop-shadow-lg uppercase tracking-wide"
    >
      Victoire !
    </Motion>

    <!-- Avatar du gagnant -->
    <Motion
      :initial="{ scale: 0.5, opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :transition="{ delay: 1, duration: 0.8, ease: 'easeOut' }"
      class="mt-6 flex flex-col items-center"
    >
      <img
        :src="winner.avatar"
        alt="Winner avatar"
        class="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-lg object-cover"
      />
      <p class="mt-4 text-3xl font-bold text-yellow-300">{{ winner.username }}</p>
    </Motion>

    <!-- Raison de la victoire -->
    <Motion
      :initial="{ opacity: 0, y: 50 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 1.8, duration: 0.8 }"
      class="mt-2 text-lg text-gray-300 italic"
    >
      {{ reason }}
    </Motion>

    <!-- Confettis -->
    <Motion
      :initial="{ y: 200, opacity: 0, rotate: 0 }"
      :animate="{ y: [-100, -400], opacity: [1, 0], rotate: [0, 360] }"
      :transition="{ delay: 1, duration: 2.5, repeat: Infinity, repeatDelay: 1 }"
      class="absolute text-4xl text-yellow-400"
    >
      🎊
    </Motion>
  </div>
</template>

<style scoped>
@keyframes pulseGlow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
</style>
