import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useProfileStore } from '@/stores/profile'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/game/:id',
      name: 'game',
      component: () => import('../views/GameView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/review/:id',
      name: 'review',
      component: () => import('../views/GameReviewView.vue'),
    },
    {
      path: '/game/bot/:level(\\d{1})', // level [0,4]
      name: 'bot-game',
      component: () => import('../views/GameView.vue'),
      beforeEnter: (to, from, next) => {
        const level = parseInt(to.params.level);
        if (level >= 0 && level <= 4) { next(); }
        else { next({ name: 'home' }); }
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const profileStore = useProfileStore();
  if (to.meta.requiresAuth != undefined && to.meta.requiresAuth != profileStore.isLoggedIn) {
    const redirect = to.meta.requiresAuth ? 'login' : 'home';
    return next({ name: redirect })
  }
  return next();
});

export default router
