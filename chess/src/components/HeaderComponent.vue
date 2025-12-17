<script setup>
    import { useRouter, RouterLink } from 'vue-router';
    import AvatarComponent from '@/components/AvatarComponent.vue';
    import { useProfileStore } from '@/stores/profile';
    import { computed } from 'vue'

    const router = useRouter();
    const profileStore = useProfileStore();

    const profile = computed(() => profileStore.profile)
    const isLogged = computed(() => profileStore.isLoggedIn)

    const logout = () => {
        profileStore.logout();
        router.push({ name: 'home'});
    }
</script>

<template>
    <div class="navbar bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/30">
        <!-- Decoration Glow -->
        <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <div class="flex-none">
            <div class="drawer z-50">
                <input id="sidebar" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">
                    <label for="sidebar" class="btn btn-ghost btn-circle text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </label>
                </div>
                <div class="drawer-side">
                    <label for="sidebar" aria-label="close sidebar" class="drawer-overlay backdrop-blur-sm bg-black/40"></label>
                    <ul class="menu bg-zinc-900 min-h-full w-80 p-4 border-r border-white/5 text-zinc-300">
                        <!-- Sidebar content here -->
                         <div class="mb-4 px-4 text-xl font-bold text-white">Menu</div>
                        <li><RouterLink :to="{ name: 'home' }" class="hover:bg-purple-600/20 hover:text-purple-300 focus:text-purple-300 active:bg-purple-600/30">Dashboard</RouterLink></li>
                        <li><RouterLink :to="{ name: 'profile' }" class="hover:bg-purple-600/20 hover:text-purple-300 focus:text-purple-300 active:bg-purple-600/30">Games</RouterLink></li>
                        <li><RouterLink :to="{ name: 'home' }" class="hover:bg-purple-600/20 hover:text-purple-300 focus:text-purple-300 active:bg-purple-600/30">Settings</RouterLink></li>
                    </ul>
                </div>
            </div>
            
        </div>
        <div class="flex-1 px-2">
            <router-link :to="{ name: 'home' }" class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 hover:to-purple-300 transition-all duration-300 tracking-tight flex items-center gap-2">
                <img src="@/assets/logo.png" alt="Logo" class="w-10 h-10 object-contain" /> Checkmate.com
            </router-link>
        </div>
        <div class="flex gap-3 items-center px-2">
            <router-link v-if="isLogged" :to="{ name : 'profile' }" class="flex items-center gap-3 group p-1 pr-4 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                <div class="ring-2 ring-purple-500/50 rounded-full group-hover:ring-purple-400 transition-all">
                     <AvatarComponent status="online" :avatar-url="profile.avatar"/>
                </div>
                <div class="hidden md:block font-medium text-zinc-300 group-hover:text-white transition-colors">{{ profile.username }}</div>
            </router-link>

            <router-link v-if="!isLogged" :to="{ name: 'login' }" class="btn btn-sm h-10 px-6 bg-white/5 hover:bg-white/10 border-white/10 text-white font-medium backdrop-blur-md">
                Login
            </router-link>
            
            <button v-else @click="logout" class="btn btn-sm btn-circle btn-ghost text-zinc-400 hover:text-red-400 hover:bg-red-400/10 tooltip tooltip-bottom" data-tip="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
</template>