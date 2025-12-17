<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { Motion } from 'motion-v';

const router = useRouter();
const profileStore = useProfileStore()

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    await profileStore.login(email.value, password.value);
    router.push({ name: 'home' }); 
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="grow w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden selection:bg-purple-500 selection:text-white py-20">
    
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-fuchsia-900/10 rounded-full blur-[80px]"></div>
    </div>

    <!-- Main Content -->
    <Motion
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, ease: 'easeOut' }"
        class="card w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/5 shadow-2xl relative z-10 overflow-hidden hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-500/30 transition-all duration-500"
    >
        <!-- Card Glow -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

        <div class="card-body p-8 sm:p-10 margin-auto">
            <div class="text-center mb-8">
                <Motion 
                    :initial="{ scale: 0.8, opacity: 0 }"
                    :animate="{ scale: 1, opacity: 1 }"
                    :transition="{ delay: 0.2, duration: 0.5 }"
                    class="inline-block p-3 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 mb-4 ring-1 ring-white/10"
                >
                    <img src="@/assets/logo.png" alt="Logo" class="w-12 h-12 object-contain" />
                </Motion>
                <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 tracking-tight">Welcome Back</h2>
                <p class="text-zinc-400 mt-2 text-sm">Enter your credentials to continue your journey.</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
                
                <div class="group">
                     <label class="label pl-1 py-1"><span class="label-text text-xs uppercase font-bold tracking-wider text-zinc-500 group-focus-within:text-purple-400 transition-colors">Email Address</span></label>
                    <div class="relative">
                        <input 
                            v-model="email" 
                            type="text" 
                            class="input input-bordered w-full bg-zinc-950/50 border-white/5 focus:border-purple-500/50 text-white placeholder-zinc-600 pl-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] focus:scale-[1.01]" 
                            placeholder="grandmaster@chess.com"
                            required 
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 peer-focus:text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="group">
                    <label class="label pl-1 py-1"><span class="label-text text-xs uppercase font-bold tracking-wider text-zinc-500 group-focus-within:text-purple-400 transition-colors">Password</span></label>
                    <div class="relative">
                        <input 
                            v-model="password" 
                            :type="showPassword ? 'text' : 'password'" 
                            class="input input-bordered w-full bg-zinc-950/50 border-white/5 focus:border-purple-500/50 text-white placeholder-zinc-600 pl-10 pr-10 transition-all duration-300 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] focus:scale-[1.01]" 
                            placeholder="••••••••"
                            required 
                        />
                         <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <button 
                            type="button"
                            @click="togglePassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                                <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                <path fill-rule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745A10.029 10.029 0 0018 10c0-4.257-3.636-6.91-7.893-6.91-1.636 0-3.14.404-4.453 1.115l-1.374-1.374zM4.795 7.973C3.606 8.528 2.6 9.395 1.95 10c.85 1.91 2.376 3.447 4.246 4.417l2.843-2.843a2.5 2.5 0 01-3.243-3.243L4.795 7.973zm2.528-2.528l1.458 1.458a4.015 4.015 0 013.916 3.916l1.393 1.393A4.01 4.01 0 0014 10a4 4 0 00-4-4 4.01 4.01 0 00-2.677 1.445z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div class="flex justify-end mt-2">
                        <a href="#" class="text-xs text-zinc-500 hover:text-purple-400 transition-colors">Forgot password?</a>
                    </div>
                </div>

                <button 
                    type="submit" 
                    class="btn btn-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 relative overflow-hidden group transition-all duration-300"
                >
                    <span class="relative z-10 flex items-center gap-2">
                        Sign In
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 transition-transform group-hover:translate-x-1">
                            <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
                        </svg>
                    </span>
                    <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>

                <div class="text-center mt-6">
                    <p class="text-zinc-500 text-sm">
                        Don't have an account? 
                        <RouterLink :to="{ name: 'register' }" class="text-zinc-300 hover:text-white font-medium underline decoration-purple-500/50 hover:decoration-purple-500 transition-all">
                        Create one now
                        </RouterLink>
                    </p>
                </div>
            </form>
        </div>
    </Motion>
  </div>
</template>