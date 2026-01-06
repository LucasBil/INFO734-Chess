<template>
    <div class="min-h-screen bg-base-100 p-4 md:p-8">
        <div class="max-w-6xl mx-auto space-y-8" v-if="profileStore.isLoggedIn">
            <!-- Header Section -->
            <div class="card bg-base-200 shadow-xl">
                <div class="card-body flex flex-col md:flex-row items-center gap-6">
                    <div class="avatar online placeholder">
                        <div class="bg-neutral text-neutral-content rounded-full w-24 md:w-32 ring ring-primary ring-offset-base-100 ring-offset-2">
                             <img v-if="profileStore.profile.avatar" :src="profileStore.profile.avatar" alt="Avatar" />
                             <span v-else class="text-3xl">{{ profileStore.profile.username.charAt(0).toUpperCase() }}</span>
                        </div>
                    </div>
                    <div class="text-center md:text-left flex-1">
                        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {{ profileStore.profile.username }}
                        </h1>
                        <p class="text-base-content/70 mt-1">{{ profileStore.profile.email }}</p>
                        <div class="flex gap-2 justify-center md:justify-start mt-4">
                             <div class="badge badge-primary">Member</div>
                             <div class="badge badge-outline">Online</div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                         <button class="btn btn-outline btn-error btn-sm" @click="handleLogout">
                            Logout
                         </button>
                    </div>
                </div>
            </div>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="stat bg-base-200 rounded-box shadow">
                    <div class="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div class="stat-title">Total Games</div>
                    <div class="stat-value text-primary">{{ totalGames }}</div>
                    <div class="stat-desc">Played matches</div>
                </div>
                
                <div class="stat bg-base-200 rounded-box shadow">
                    <div class="stat-figure text-success">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div class="stat-title">Wins</div>
                    <div class="stat-value text-success">{{ stats.wins }}</div>
                    <div class="stat-desc">{{ winRate }}% Win Rate</div>
                </div>
                
                <div class="stat bg-base-200 rounded-box shadow">
                    <div class="stat-figure text-error">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div class="stat-title">Losses</div>
                    <div class="stat-value text-error">{{ stats.losses }}</div>
                </div>

                 <div class="stat bg-base-200 rounded-box shadow">
                    <div class="stat-figure text-neutral-content">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <div class="stat-title">Draws</div>
                    <div class="stat-value">{{ stats.draws }}</div>
                </div>
            </div>

            <!-- Match History -->
             <div class="card bg-base-200 shadow-xl">
                 <div class="card-body">
                     <h2 class="card-title mb-4">Match History</h2>
                     <div v-if="loading" class="flex justify-center p-8">
                         <span class="loading loading-spinner loading-lg text-primary"></span>
                     </div>
                     <div v-else-if="games.length === 0" class="text-center py-8 opacity-50">
                         No games played yet. Go play some chess!
                     </div>
                     <div v-else class="overflow-x-auto">
                         <table class="table table-zebra w-full">
                             <thead>
                                 <tr>
                                     <th>Date</th>
                                     <th>Side</th>
                                     <th>Opponent</th>
                                     <th>Result</th>
                                     <th>Length</th>
                                     <th></th>
                                 </tr>
                             </thead>
                             <tbody>
                                 <tr v-for="game in sortedGames" :key="game._id" class="hover">
                                     <td>{{ formatDate(game.createdAt) }}</td>
                                     <td>
                                         <div class="badge gap-2" :class="isWhite(game) ? 'badge-ghost' : 'badge-neutral'">
                                            <div class="w-2 h-2 rounded-full" :class="isWhite(game) ? 'bg-base-content' : 'bg-base-100'"></div>
                                            {{ isWhite(game) ? 'White' : 'Black' }}
                                         </div>
                                     </td>
                                     <td class="font-medium">
                                        {{ getOpponentName(game) }}
                                     </td>
                                     <td>
                                         <div class="badge font-bold" :class="getResultBadgeClass(game)">
                                             {{ getResultLabel(game) }}
                                         </div>
                                     </td>
                                     <td class="font-mono text-sm">{{ game.moves ? Math.ceil(game.moves.length / 2) : 0 }} moves</td>
                                     <td>
                                        <router-link :to="{ name: 'review', params: { id: game._id } }" class="btn btn-sm btn-primary">Replay</router-link>
                                     </td>
                                 </tr>
                             </tbody>
                         </table>
                     </div>
                 </div>
             </div>
        </div>
        
        <div v-else class="flex items-center justify-center h-[80vh]">
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-4">Guest User</h2>
                <router-link to="/login" class="btn btn-primary">Login to view profile</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useApiStore } from '@/stores/api';
import { useRouter } from 'vue-router';

const profileStore = useProfileStore();
const apiStore = useApiStore();
const router = useRouter();

const games = ref([]);
const loading = ref(true);

const totalGames = computed(() => games.value.length);

const stats = computed(() => {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    
    const userId = profileStore.profile?.id;
    if (!userId) return { wins, losses, draws };

    games.value.forEach(game => {
        if (game.result === 'draw') {
            draws++;
        } else if (game.result === 'white' && isWhite(game)) {
            wins++;
        } else if (game.result === 'black' && !isWhite(game)) {
            wins++;
        } else {
            losses++;
        }
    });

    return { wins, losses, draws };
});

const winRate = computed(() => {
    if (totalGames.value === 0) return 0;
    return Math.round((stats.value.wins / totalGames.value) * 100);
});

const sortedGames = computed(() => {
    return [...games.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
});

const isWhite = (game) => {
    return game.white && game.white._id === profileStore.profile?.id;
};

const getOpponentName = (game) => {
    if (isWhite(game)) {
        return game.black ? game.black.username : 'Unknown (Deleted)';
    } else {
        return game.white ? game.white.username : 'Unknown (Deleted)';
    }
};

const getResultLabel = (game) => {
    const isPlayerWhite = isWhite(game);
    if (game.result === 'draw') return 'DRAW';
    if (game.result === 'white') return isPlayerWhite ? 'WON' : 'LOST';
    if (game.result === 'black') return !isPlayerWhite ? 'WON' : 'LOST';
    return 'UNKNOWN';
};

const getResultBadgeClass = (game) => {
    const label = getResultLabel(game);
    if (label === 'WON') return 'badge-success text-success-content';
    if (label === 'LOST') return 'badge-error text-error-content';
    return 'badge-ghost';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const handleLogout = async () => {
    await profileStore.logout();
    router.push('/');
};

onMounted(async () => {
    if (profileStore.isLoggedIn) {
        try {
            const fetched = await apiStore.fetchUserGames(profileStore.profile.id);
            if (fetched) {
                games.value = fetched;
            }
        } catch (e) {
            console.error("Failed to fetch games", e);
        } finally {
            loading.value = false;
        }
    } else {
        loading.value = false;
    }
});
</script>