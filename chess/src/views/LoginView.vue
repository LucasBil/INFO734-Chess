<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useProfileStore } from '@/stores/profile';

    const profileStore = useProfileStore();
    const router = useRouter();

    let email = ref(null);
    let password = ref(null);

    function submit() {
        if (email.value != null && password.value != null){
            profileStore.login(email.value, password.value);
            router.push({ name: 'home'});
        }
    }
</script>

<template>
    <div class="hero grow">
        <div class="hero-content flex-col lg:flex-row-reverse w-75">
            <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div class="card-body">
                    <fieldset class="fieldset">
                        <label class="label">Email</label>
                        <input v-model="email" type="email" class="input" placeholder="Email" />
                        <label class="label">Password</label>
                        <input v-model="password" type="password" class="input" placeholder="Password" />
                        <div><a class="link link-hover">Forgot password?</a></div>
                        <button @click="submit" class="btn btn-neutral mt-4">Login</button>
                    </fieldset>
                </div>
            </div>
        </div>
    </div>
</template>