import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useProfileStore } from './stores/profile'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const profileStore = useProfileStore()
profileStore.loadStorage();

app.mount('#app')
