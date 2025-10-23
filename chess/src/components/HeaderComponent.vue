<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="navbar bg-base-100 shadow-sm gap-2">
        <div class="flex-none">
            <div class="drawer">
                <input id="sidebar" type="checkbox" class="drawer-toggle" />
                <div class="drawer-content">
                    <label for="sidebar" class="btn drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-5 w-5 stroke-current"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </label>
                </div>
                <div class="drawer-side">
                    <label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul class="menu bg-base-200 min-h-full w-80 p-4">
                        <!-- Sidebar content here -->
                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div>
            
        </div>
        <div class="flex-1">
            <router-link :to="{ name: 'home' }" class="text-xl font-medium">chess.com</router-link>
        </div>
        <div class="flex-none">
            <router-link :to="{ name: 'login' }" class="btn btn-ghost">Login</router-link>
        </div>
    </div>
</template>