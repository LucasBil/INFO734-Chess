import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'; // for test
import Profile from '@/models/Profile.js'

export const useProfileStore = defineStore('profile', {
    state: () => {
        return {
            profile: null,
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
        login(profilename, password) {
            // TODO : request to backend
            const profile = new Profile(uuidv4(), profilename, 'https://pbs.twimg.com/media/FNdwc00XsAAjYYy.jpg');
            this.setProfile(profile);
        },
        logout() {
            this.profile = null;
            localStorage.removeItem('profile');
        }
    },
    getters : {
        isLoggedIn: (state) => !!state.profile,
    }
})