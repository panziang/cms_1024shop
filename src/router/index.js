import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './user'
import orderRoutes from './order'
import productRoutes from './product'
import couponRoutes from './coupon'


const indexRoutes = [
  {
    path: '/',
    redirect: '/user-manage',
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: indexRoutes.concat(
    userRoutes,
    orderRoutes,
    productRoutes,
    couponRoutes
  ),

  scrollBehavior () {
    return { top: 0 };
  }
})

export default router
