import { defineStore } from 'pinia'
import Profile from '@/models/Profile.js';
import { useApiStore } from '@/stores/api';

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            profile: null,
            api: useApiStore(),
        }
    },
    actions : {
        setProfile(profile) {
            this.profile = profile;
            localStorage.setItem('profile', JSON.stringify(profile));
        },
        loadStorage() {
            const profile = localStorage.getItem('profile');
            if (profile) {
                const json = JSON.parse(profile);
                this.profile = Profile.loadJSONModel(json);
            }
        },
        async login(identifier, password) {
            const json = await this.api.login(identifier, password);
            const profile = Profile.loadJSONModel(json);
            this.setProfile(profile);
        },
        async logout() {
            await this.api.logout();
            this.profile = null;
            localStorage.removeItem('profile');
        }
    },
    getters : {
        isLoggedIn: (state) => !!state.profile,
    }
})