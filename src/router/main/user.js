/**
 * 用户路由
 */
export default [
  {
    path: "/main/user-manage",
    component: () => import("@/views/main/user/user-manage.vue")
  },
  {
    path: "/main/address-manage",
    component: () => import("@/views/main/user/address-manage.vue")
  },
]
