import { createRouter, createWebHistory } from 'vue-router'

const indexRoutes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/main.vue'),
    children: [
      {
        path: "coupon-manage",
        component: () => import("@/views/main/coupon/coupon-manage.vue")
      },
      {
        path: "order-manage",
        component: () => import("@/views/main/order/order-manage.vue")
      },
      {
        path: "product-manage",
        component: () => import("@/views/main/product/product-manage.vue")
      },
      {
        path: "user-manage",
        component: () => import("@/views/main/user/user-manage.vue")
      },
      {
        path: "address-manage",
        component: () => import("@/views/main/user/address-manage.vue")
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/not-found/not-found.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes: indexRoutes.concat(
  //   userRoutes,
  //   orderRoutes,
  //   productRoutes,
  //   couponRoutes
  // ),
  routes: indexRoutes,

  scrollBehavior () {
    return { top: 0 };
  }
})

router.beforeEach((to) => {
  if (to.path !== '/login') {
    const token = localStorage.getItem('1024token')
    if (!token) {
      return '/login'
    }
  }
})

export default router
