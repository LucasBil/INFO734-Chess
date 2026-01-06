<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['close', 'select']);

const timeControls = [
    {
        category: 'Bullet',
        options: [
            { label: '1+3', time: 1, increment: 3 },
            { label: '2+1', time: 2, increment: 1 },
            { label: '3+0', time: 3, increment: 0 },
        ]
    },
    {
        category: 'Rapid',
        options: [
            { label: '5+0', time: 5, increment: 0 },
            { label: '10+0', time: 10, increment: 0 },
            { label: '15+0', time: 15, increment: 0 },
        ]
    },
    {
        category: 'Classic',
        options: [
            { label: '30+0', time: 30, increment: 0 },
            { label: '60+0', time: 60, increment: 0 },
            { label: '90+0', time: 90, increment: 0 },
        ]
    }
];

function selectTime(option) {
    emit('select', {
        time: option.time * 60 * 1000,
        increment: option.increment * 1000
    });
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
        <div class="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden">
            <!-- Background Glow -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div class="flex items-center justify-between mb-8 relative z-10">
                <h2 class="text-2xl font-bold text-white">Select Time Control</h2>
                <button 
                    @click="$emit('close')"
                    class="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                    <XMarkIcon class="w-6 h-6" />
                </button>
            </div>

            <div class="grid gap-8 relative z-10">
                <div v-for="category in timeControls" :key="category.category">
                    <h3 class="text-zinc-400 font-medium mb-3 uppercase text-sm tracking-wider">{{ category.category }}</h3>
                    <div class="grid grid-cols-3 gap-3">
                        <button
                            v-for="option in category.options"
                            :key="option.label"
                            @click="selectTime(option)"
                            class="group relative p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 hover:border-purple-500/50 transition-all duration-300 text-left"
                        >
                            <div class="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                {{ option.label }}
                            </div>
                            <!-- Hover Glow -->
                            <div class="absolute inset-0 rounded-xl bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
