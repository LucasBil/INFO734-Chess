<script setup>
  import OnlineBattleButton from '@/components/OnlineBattleButton.vue';
  import BotBattleButton from '@/components/BotBattleButton.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 mt-10 text-white p-10 rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6">Welcome to Chess.com</h1>
    <p class="text-lg mb-8">Choose your battle mode:</p>
    <BotBattleButton />
    <OnlineBattleButton />
    <div class="mt-8 text-center max-w-md">
      <h2 class="text-2xl font-semibold mb-4">About Chess.com</h2>
      <p class="text-base">
        Chess.com is the ultimate platform for chess enthusiasts of all levels. Whether you're a beginner looking to learn the basics or an experienced player seeking challenging opponents, we've got you covered. Enjoy seamless gameplay, track your progress, and connect with a vibrant community of chess lovers worldwide.
      </p>
    </div>
  </div>
</template>