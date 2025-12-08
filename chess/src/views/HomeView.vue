<script setup>
  import OnlineBattleButton from '@/components/OnlineBattleButton.vue';
  import BotBattleButton from '@/components/BotBattleButton.vue';
  import HistoriqueComponent from '@/components/HistoriqueComponent.vue';


</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 mt-10 text-white p-10 rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6">Welcome to Chess.com</h1>
    <p class="text-lg mb-8">Choose your battle mode:</p>
    <BotBattleButton />
    <OnlineBattleButton />
    <div class="mt-8 text-center max-w-md">
      <h2 class="text-2xl font-semibold mb-4">Historique des Games</h2>
      <div>
        <HistoriqueComponent />
        
      </div>
    </div>
  </div>
</template>