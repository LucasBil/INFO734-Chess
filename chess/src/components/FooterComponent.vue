<script setup>
    import { ref } from 'vue'
    const year = ref(new Date().getFullYear())
</script>

<template>
    <footer class="footer footer-center bg-zinc-950/80 backdrop-blur-xl text-zinc-400 p-10 border-t border-white/5 relative z-50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/30">
        <!-- Decoration Glow -->
        <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <aside>
            <div class="flex items-center gap-2 mb-2">
                <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12 object-contain" />
                <p class="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                    Checkmate.com
                </p>
            </div>
            <p class="font-medium text-zinc-500">
                Play, Learn, and Master the timeless game.<br/>
                Providing reliable tech since 2024
            </p> 
            <p class="mt-4 text-xs">Copyright © {{ year }} - All rights reserved</p>
        </aside>
    </footer>
</template>