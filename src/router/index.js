import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './home'
import userRoutes from './user'


const indexRoutes = [
  {
    path: '/',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: indexRoutes.concat(
    homeRoutes,
    userRoutes
  ),

  scrollBehavior () {
    return { top: 0 };
  }
})

export default router
