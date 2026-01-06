<script setup>
import { ref, onMounted, computed } from 'vue';
import {RouterLink } from 'vue-router';
import { useApiStore } from '@/stores/api';
import { useProfileStore } from '@/stores/profile';
import king from '@/assets/icons/king.vue';

const profileStore = useProfileStore();
const apiStore = useApiStore();

//variable réactive pour stocker la liste games reçue de l'API
const rawGames = ref([]);

const fetchGames = async () => {
  const id = profileStore.profile?.id;
  
  if (id) {
    try {
      //console.log("Fetching games for email:", id);
      const gamesFromApi = await apiStore.fetchUserGames(id);
      //console.log("Result:", gamesFromApi);
      
      if (Array.isArray(gamesFromApi)) {
        rawGames.value = gamesFromApi;
      }
    } catch (e) {
      console.error("Erreur lors de la récupération des games:", e);
    }
  }
};

onMounted(() => {
  fetchGames();
});

//Computed pour obtenir les 5 DERNIERS éléments
const lastFiveGames = computed(() => {
  // slice(-5) prend les 5 derniers éléments du tableau
  // reverse() les inverse pour afficher le plus récent tout en haut
  return rawGames.value.slice(-5).reverse();
});

</script>

<template>
  <div class="historique-container">

    <RouterLink v-for="(game, index) in lastFiveGames" :to="{ name: 'review', params: { id: game._id } }" 
      :key="game.result || index" class="historique flex items-center justify-center gap-4"
    >
      <div class="text-white font-bold text-xl flex items-center">
        <king class="inline w-6 h-6 mr-2" />
      </div>
      <p class="grow">
        <span v-if="game.moves && game.moves.length > 0 && game.moves[0].date">Game du {{ new Date(game.moves[0].date).toLocaleDateString('fr-FR') }} | </span>
        <span v-else>Game {{ index + 1 }} | </span>
        <span v-if="game.result == 'black' && game.black.id == id">Victoire</span>
        <span v-else-if="game.result == 'white' && game.white.id == id">Victoire</span>
        <span v-else>Défaite</span>
      </p>
    </RouterLink>

    <div v-if="lastFiveGames.length === 0" class="historique">
      Pas encore de parties jouées.
    </div>


  </div>
</template>

<style scoped>
.historique-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-items: center;
}

.historique {
  background-color: #AB2BFF;
  border: 1px solid white;
  color: white;
  padding: 15px 25px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 5px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-items: center;
}
</style>