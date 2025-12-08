<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApiStore } from '@/stores/api';
import { useProfileStore } from '@/stores/profile';

const router = useRouter();
const profileStore = useProfileStore();
const apiStore = useApiStore();

//variable réactive pour stocker la liste games reçue de l'API
const rawGames = ref([]);

const fetchGames = async () => {
  const email = profileStore.profile?.email;
  
  if (email) {
    try {
      const gamesFromApi = await apiStore.fetchUserGames(email);
      
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
  // reverse() les inverse pour afficher le plus récent tout en haut (optionnel)
  return rawGames.value.slice(-5).reverse();
});

</script>

<template>
  <div class="historique-container">
    
    <div 
      v-for="(game, index) in lastFiveGames" 
      :key="game.result || index" 
      class="historique"
    >
      Game {{ index + 1 }} -> résultat : {{ game.result }} points
    </div>

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
}
</style>