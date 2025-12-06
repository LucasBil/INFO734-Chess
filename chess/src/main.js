import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useProfileStore } from './stores/profile'
import { useApiStore } from './stores/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const profileStore = useProfileStore();
const apiStore = useApiStore();
profileStore.loadStorage();
apiStore.loadStorage();

app.mount('#app')
