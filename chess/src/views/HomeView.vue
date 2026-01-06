<script setup>
  import OnlineBattleButton from '@/components/OnlineBattleButton.vue';
  import BotBattleButton from '@/components/BotBattleButton.vue';
  import HistoriqueComponent from '@/components/HistoriqueComponent.vue';
</script>

<template>
  <!-- Video Background -->
  <video autoplay muted loop playsinline class="fixed top-0 left-0 w-full h-full object-cover -z-1 bg-black grayscale">
    <source src="/chess-dark-loop.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  
  <!-- Dark Overlay -->
  <div class="fixed top-0 left-0 w-full h-full bg-black/60 -z-10"></div>

  <!-- Content -->
  <div class="relative z-10 flex flex-col items-center justify-center gap-4 mt-10 text-white p-10 rounded-lg">
    <h1 class="text-4xl font-bold mb-6 drop-shadow-lg">Welcome to Chess.com</h1>
    <p class="text-lg mb-8 drop-shadow-md">Choose your battle mode:</p>
    <BotBattleButton />
    <OnlineBattleButton />
    <div class="mt-8 text-center max-w-md">
      <h2 class="text-2xl font-semibold mb-4 drop-shadow-md">Historique des Games</h2>
      <div>
        <HistoriqueComponent />
      </div>
    </div>
  </div>
</template>