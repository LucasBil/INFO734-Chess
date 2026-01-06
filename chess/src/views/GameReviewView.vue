<script setup>
    import { onMounted, ref, computed, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useProfileStore } from '@/stores/profile';
    import { useApiStore } from '@/stores/api';
    import { Chess } from 'chess.js';
    
    // Components
    import BoardComponent from '@/components/BoardComponent.vue';
    import SidebarComponent from '@/components/SidebarComponent.vue';
    
    import Profile from '@/models/Profile';
    
    import AnonymeIcon from '@/assets/icons/anonyme.svg'
    import { BackwardIcon, ForwardIcon, BookOpenIcon, PlayIcon, PauseIcon } from '@heroicons/vue/24/outline';
    import Pieces from '@/utils/pieces';

    const route = useRoute();
    const router = useRouter();
    const profileStore = useProfileStore();
    const apiStore = useApiStore();
    
    const board = ref(null);
    const sidebar = ref(null);
    
    const idGame = route.params.id;
    const gameData = ref(null);
    const game = new Chess();

    const whitePlayer = ref(null);
    const blackPlayer = ref(null);
    
    // We'll default to viewing from white's perspective, or maybe the user's if they were part of it
    const orientation = ref('white');
    const side = ref('white'); // 'white' or 'black' (game logic side) - though for review we just watch. 'side' prop in BoardComponent usually limits interactions.
    
    const whiteTime = ref(0);
    const blackTime = ref(0);
    const activePlayer = ref('w'); 
    const moveHistory = ref([]);

    // Auto-play state
    const isPlaying = ref(false);
    let playInterval = null;


    
    function findMoveBetweenFens(fenBefore, fenAfter) {
        const chess = new Chess(fenBefore);
        const moves = chess.moves({ verbose: true });

        for (const move of moves) {
            const clone = new Chess(fenBefore);
            clone.move(move);

            if (clone.fen() === fenAfter) {
                return {
                    san: move.san,
                    uci: move.from + move.to + (move.promotion ?? ""),
                    move
                };
            }
        }

        return null;
    }

    onMounted(async () => {
        if (!idGame) {
            router.push({ name: 'home' });
            return;
        }

        const fetchedGame = await apiStore.fetchGameById(idGame);
        if (!fetchedGame) {
            console.error("Game not found");
            return; // Handle error
        }
        gameData.value = fetchedGame;
        console.log(fetchedGame);
        console.log(gameData.value);

        // Setup Players
        if (fetchedGame.white && typeof fetchedGame.white === 'object') {
             whitePlayer.value = new Profile(fetchedGame.white._id, fetchedGame.white.username, AnonymeIcon);
        } else {
             whitePlayer.value = new Profile(fetchedGame.white, 'White', AnonymeIcon);
             // Optionally fetch user details here
             if(fetchedGame.white) {
                apiStore.getUserById(fetchedGame.white).then(u => {
                    if(u) whitePlayer.value = new Profile(u._id, u.username, AnonymeIcon);
                });
             }
        }

        if (fetchedGame.black && typeof fetchedGame.black === 'object') {
             blackPlayer.value = new Profile(fetchedGame.black._id, fetchedGame.black.username, AnonymeIcon);
        } else {
             blackPlayer.value = new Profile(fetchedGame.black, 'Black', AnonymeIcon);
             if(fetchedGame.black) {
                apiStore.getUserById(fetchedGame.black).then(u => {
                    if(u) blackPlayer.value = new Profile(u._id, u.username, AnonymeIcon);
                });
             }
        }

        // Determine orientation (if logged in user played)
        const currentUserId = profileStore.profile?._id;
        if (currentUserId) {
            if (fetchedGame.black === currentUserId || (fetchedGame.black?._id === currentUserId)) {
                orientation.value = 'black';
            }
        }
        side.value = orientation.value; // For locking board if needed, or just visual

        // Replay moves into Sidebar
        // We use a watcher because Sidebar renders conditionally (v-if) based on players being loaded
        

        const moves = [
            "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            ...fetchedGame.moves.map(m => m.fen)
        ]
        for (let i = 0; i < moves.length - 1; i++) {
            let detail = findMoveBetweenFens(moves[i], moves[i+1]);
            moveHistory.value.push({ fen: moves[i+1], notation: detail.san});
        }
    });



    // --- Navigation Logic ---

    function onJumpToMove(payload) {
        if (payload.index === -1) {
            board.value?.resetToStart();
            activePlayer.value = 'w';
        } else if (payload.fen) {
            board.value?.restorePosition(payload.fen);
            // Determine active player from FEN (second token)
             const tokens = payload.fen.split(' ');
             activePlayer.value = tokens[1];
        }
    }

    // Button Handlers
    function goBack() {
        stopAutoPlay();
        sidebar.value?.goBack();
    }

    function goForward() {
        stopAutoPlay();
        sidebar.value?.goForward();
    }

    function togglePlay() {
        if (isPlaying.value) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }

    function startAutoPlay() {
        if (isPlaying.value) return;
        isPlaying.value = true;
        
        // Auto advance every 1s
        playInterval = setInterval(() => {
            if (sidebar.value) {
                // Check if we can go forward
                const current = sidebar.value.currentMoveIndex;
                const total = sidebar.value.moves.length;
                if (current < total - 1) {
                    sidebar.value.goForward();
                } else {
                    stopAutoPlay();
                }
            }
        }, 1000);
    }

    function stopAutoPlay() {
        isPlaying.value = false;
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    }

    function handleMove(moveData) {
        console.log("Move attempted in review", moveData);
    }
</script>

<template>
    <div class="h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-base-100 overflow-hidden">

        <div class="flex-1 flex flex-col min-h-0 p-2 lg:p-4 gap-4 justify-center items-center">
            
            <div class="w-full max-w-[75vh] aspect-square relative shadow-2xl rounded-sm">
                <!-- Set draggable pieces to false for pure review -->
                <BoardComponent 
                    v-if="orientation" 
                    class="absolute inset-0 w-full h-full"
                    ref="board"
                    :side="side"
                    :orientation="orientation"
                    :spare-pieces="false"
                    :draggable-pieces="false" 
                    @move="handleMove"
                />
            </div>

            <div class="join shadow-lg shrink-0">
                <button class="btn btn-sm btn-soft join-item" @click="goBack">
                    <BackwardIcon class="w-5 h-5" />
                </button>
                
                <button class="btn btn-sm join-item" @click="togglePlay">
                    <component :is="isPlaying ? PauseIcon : PlayIcon" class="w-5 h-5" />
                </button>
                
                <button class="btn btn-sm btn-soft join-item" @click="goForward">
                    <ForwardIcon class="w-5 h-5" />
                </button>
            </div>
        </div>

        <div class="w-full lg:w-96 bg-base-200 border-l border-base-300 flex-none h-[35vh] lg:h-auto z-10">
            <SidebarComponent
                v-if="whitePlayer && blackPlayer"
                ref="sidebar"
                :white-time="whiteTime"
                :black-time="blackTime"
                :active-player="activePlayer"
                :white-player="whitePlayer"
                :black-player="blackPlayer"
                :orientation="orientation"
                :move-history="moveHistory"
                @jump-to-move="onJumpToMove"
            />
             <div v-else class="flex items-center justify-center h-full">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </div>
    </div>
</template>