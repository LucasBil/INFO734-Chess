<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { ClockIcon } from '@heroicons/vue/24/outline';
import Pieces from '@/utils/pieces.js';

const props = defineProps({
    whiteTime: { type: Number, required: true },
    blackTime: { type: Number, required: true },
    activePlayer: { type: String, default: null },
    whitePlayer: { type: Object, required: true },
    blackPlayer: { type: Object, required: true },
    orientation: { type: String, default: 'white' }
});

const emit = defineEmits(['jump-to-move']);

// Move history
const moves = ref([]);
const currentMoveIndex = ref(-1);
const movesContainer = ref(null);

// Auto-scroll watcher
watch(() => moves.value.length, async () => {
    await nextTick();
    if (movesContainer.value) {
        movesContainer.value.scrollTop = movesContainer.value.scrollHeight;
    }
});

function addMove(move) {
    // If we were viewing history and a new move comes in, truncate future moves
    if (currentMoveIndex.value < moves.value.length - 1) {
        moves.value = moves.value.slice(0, currentMoveIndex.value + 1);
    }
    
    moves.value.push({
        ...move,
        fen: move.fen,
        notation: generateNotation(move),
        moveNumber: Math.ceil((moves.value.length + 1) / 2)
    });
    
    currentMoveIndex.value = moves.value.length - 1;
}

function generateNotation(move) {
    let notation = '';
    
    if (move.castling) {
        return move.castling === 'k' ? 'O-O' : 'O-O-O';
    }
    
    if (move.piece !== Pieces.TYPES.PAWN) {
        notation += Pieces.getUnicode(move.color, move.piece);
    }
    
    if (move.captured) {
        if (move.piece === Pieces.TYPES.PAWN) {
            notation += move.from[0]; 
        }
        notation += 'x';
    }
    
    notation += move.to;
    
    if (move.promotion) {
        notation += '=' + Pieces.getUnicode(move.color, move.promotion);
    }
    
    if (move.checkmate) {
        notation += '#';
    } else if (move.check) {
        notation += '+';
    }
    
    return notation;
}

function jumpToMove(index) {
    currentMoveIndex.value = index;
    
    // Handle jumping to start (index -1)
    if (index === -1) {
        emit('jump-to-move', { index, fen: null }); // null indicates start position
        return;
    }

    const targetFen = moves.value[index]?.fen;
    if (targetFen) {
        emit('jump-to-move', { index, fen: targetFen });
    }
}

// --- Navigation Helpers ---
function goBack() {
    if (currentMoveIndex.value >= 0) {
        jumpToMove(currentMoveIndex.value - 1);
    }
}

function goForward() {
    if (currentMoveIndex.value < moves.value.length - 1) {
        jumpToMove(currentMoveIndex.value + 1);
    }
}

function formatTime(ms) {
    if (ms === Infinity) return '∞';
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function isLowTime(ms) {
    return ms < 20000 && ms !== Infinity;
}

const movePairs = computed(() => {
    const pairs = [];
    for (let i = 0; i < moves.value.length; i += 2) {
        pairs.push({
            number: Math.ceil((i + 1) / 2),
            white: moves.value[i],
            black: moves.value[i + 1] || null,
            whiteIndex: i,
            blackIndex: i + 1
        });
    }
    return pairs;
});

const topPlayer = computed(() => props.orientation === 'white' ? props.blackPlayer : props.whitePlayer);
const bottomPlayer = computed(() => props.orientation === 'white' ? props.whitePlayer : props.blackPlayer);
const topPlayerColor = computed(() => props.orientation === 'white' ? 'b' : 'w');
const bottomPlayerColor = computed(() => props.orientation === 'white' ? 'w' : 'b');
const topPlayerTime = computed(() => props.orientation === 'white' ? props.blackTime : props.whiteTime);
const bottomPlayerTime = computed(() => props.orientation === 'white' ? props.whiteTime : props.blackTime);

function clearHistory() {
    moves.value = [];
    currentMoveIndex.value = -1;
}

defineExpose({ addMove, clearHistory, jumpToMove, goBack, goForward });
</script>

<template>
    <div class="flex flex-col h-full bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div 
            class="p-4 border-b border-white/5 transition-colors duration-300"
            :class="{
                'bg-purple-500/10 ring-1 ring-purple-500/20': activePlayer === topPlayerColor,
                'bg-red-500/10': isLowTime(topPlayerTime)
            }"
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        <div class="w-10 h-10 rounded-full ring-2 ring-white/10">
                            <img :src="topPlayer.avatar" :alt="topPlayer.pseudo" />
                        </div>
                    </div>
                    <div class="font-semibold text-zinc-200">{{ topPlayer.pseudo }}</div>
                </div>
                <div 
                    class="flex items-center gap-2 text-lg font-mono font-bold px-3 py-1 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-300"
                    :class="{ 'text-red-400 animate-pulse bg-red-500/10 border-red-500/20': isLowTime(topPlayerTime) }"
                >
                    <ClockIcon class="w-5 h-5 opacity-70" />
                    {{ formatTime(topPlayerTime) }}
                </div>
            </div>
        </div>

        <div ref="movesContainer" class="flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar">
            <div v-if="moves.length === 0" class="text-center text-zinc-600 py-8">
                <p>No moves yet</p>
            </div>
            
            <div v-else class="space-y-0.5">
                <div 
                    v-for="pair in movePairs" 
                    :key="pair.number"
                    class="flex items-center gap-2 text-sm group"
                >
                    <div class="w-8 text-zinc-600 font-mono text-xs text-center shrink-0">
                        {{ pair.number }}.
                    </div>
                    
                    <button
                        class="flex-1 px-3 py-1.5 rounded text-left font-medium transition-all duration-200"
                        :class="{
                            'bg-purple-500/20 text-purple-200 ring-1 ring-purple-500/20': currentMoveIndex === pair.whiteIndex,
                            'text-zinc-400 hover:bg-white/5 hover:text-zinc-200': currentMoveIndex !== pair.whiteIndex
                        }"
                        @click="jumpToMove(pair.whiteIndex)"
                    >
                        {{ pair.white.notation }}
                    </button>
                    
                    <button
                        v-if="pair.black"
                        class="flex-1 px-3 py-1.5 rounded text-left font-medium transition-all duration-200"
                        :class="{
                            'bg-purple-500/20 text-purple-200 ring-1 ring-purple-500/20': currentMoveIndex === pair.blackIndex,
                            'text-zinc-400 hover:bg-white/5 hover:text-zinc-200': currentMoveIndex !== pair.blackIndex
                        }"
                        @click="jumpToMove(pair.blackIndex)"
                    >
                        {{ pair.black.notation }}
                    </button>
                    <div v-else class="flex-1"></div>
                </div>
            </div>
        </div>

        <div 
            class="p-4 border-t border-white/5 transition-colors duration-300"
            :class="{
                'bg-purple-500/10 ring-1 ring-purple-500/20': activePlayer === bottomPlayerColor,
                'bg-red-500/10': isLowTime(bottomPlayerTime)
            }"
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        <div class="w-10 h-10 rounded-full ring-2 ring-white/10">
                            <img :src="bottomPlayer.avatar" :alt="bottomPlayer.pseudo" />
                        </div>
                    </div>
                    <div class="font-semibold text-zinc-200">{{ bottomPlayer.pseudo }}</div>
                </div>
                <div 
                    class="flex items-center gap-2 text-lg font-mono font-bold px-3 py-1 rounded-lg bg-zinc-950/50 border border-white/5 text-zinc-300"
                    :class="{ 'text-red-400 animate-pulse bg-red-500/10 border-red-500/20': isLowTime(bottomPlayerTime) }"
                >
                    <ClockIcon class="w-5 h-5 opacity-70" />
                    {{ formatTime(bottomPlayerTime) }}
                </div>
            </div>
        </div>
    </div>
</template>