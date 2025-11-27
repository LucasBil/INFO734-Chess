<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useApiStore } from '@/stores/api';

const router = useRouter();
const apiStore = useApiStore();

const email = ref('');
const password = ref('');

// Clear previous errors when page loads
onMounted(() => {
  apiStore.error = null;
});

const handleLogin = async () => {
  try {
    // api.js: login(identifier, password)
    await apiStore.login(email.value, password.value);
    
    if (!apiStore.error) {
      router.push({ name: 'home' }); 
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="hero grow bg-base-200 min-h-screen">
    <div class="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl">
      
      <div class="text-center lg:text-left lg:px-6">
        <h1 class="text-5xl font-bold">Welcome Back!</h1>
        <p class="py-6">Login to access your game history and settings.</p>
      </div>

      <div class="card bg-neutral-900 w-full max-w-sm shrink-0 shadow-2xl">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">Login</h2>

          <form @submit.prevent="handleLogin">
            <fieldset class="fieldset">
              
              <div v-if="apiStore.error" role="alert" class="alert alert-error mb-4 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{{ apiStore.error }}</span>
              </div>

              <label class="label"><span class="label-text">Email or Username</span></label>
              <input v-model="email" type="text" class="input input-bordered w-full" required />

              <label class="label"><span class="label-text">Password</span></label>
              <input v-model="password" type="password" class="input input-bordered w-full" required />
              
              <div class="label">
                <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
              </div>

              <div class="form-control mt-6 flex justify-center">
                  <button type="submit" class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-[#ab2bff] px-6 font-medium text-neutral-200 duration-500"><div class="text-md translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Login</div><div class="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg></div></button>
              </div>

              <div class="divider text-xs">OR</div>

              <div class="text-center text-sm">
                Don't have an account? 
                <RouterLink :to="{ name: 'register' }" class="link link-primary font-bold">
                  Register now
                </RouterLink>
              </div>

            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>