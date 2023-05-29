<script setup>
  import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div class="app">
    <el-container class="home-container">
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="nav-menu">
          <div class="nav-menu__logo">
            <img class="nav-menu__logo-img" src="~@/assets/img/logo.svg" alt="logo" />
            <span v-if="!isCollapse" class="nav-menu__logo-title">Vue3+VITE</span>
          </div>

          <el-menu class="nav-menu__menu" active-text-color="#fff" background-color="#001529" text-color="#ccc"
            :collapse="isCollapse" :collapse-transition="false" router>

            <el-sub-menu index="1" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="user-manage" class="nav-menu__menu-item">用户管理</el-menu-item>



            </el-sub-menu>

            <el-sub-menu class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item index="product-manage" class="nav-menu__menu-item">商品管理</el-menu-item>


            </el-sub-menu>

            <el-sub-menu index="3" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>订单管理</span>
              </template>
              <el-menu-item index="order-manage" class="nav-menu__menu-item">订单管理</el-menu-item>


            </el-sub-menu>

            <el-sub-menu index="4" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>优惠券管理</span>
              </template>
              <el-menu-item index="coupon-manage" class="nav-menu__menu-item">优惠券管理</el-menu-item>


            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container class="main-page">
        <el-header class="main-page-header">Header</el-header>
        <el-main class="main-page-content">
          <div class="main-page-info">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-aside {
    border: 1px solid red;

    .nav-menu {
      height: 100%;
      color: #fff;
      background-color: #001529 !important;

      &__logo {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 48px;
        padding: 12px 10px 8px 10px;

        &-img {
          height: 28px;
          margin: 0 10px;
        }

        &-title {
          font-size: 16px;
          font-weight: 700;
        }
      }

      .nav-menu__menu {
        border-right: none;

        // background-color: inherit;
        &:not(.el-menu--collapse) {
          // width: 200px;
          // min-height: 400px;
          width: 100%;
          height: calc(100% - 48px);
        }

        // .el-menu-vertical:not(.el-menu--collapse) {
        // width: 100%;
        // height: calc(100% - 48px);
        // }

        &-sub {
          background-color: #001529 !important;

          .el-sub-menu__title {
            &>* {
              color: #ccc !important;
            }
          }

          .el-menu--collapse &-title {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }
        }

        :deep(.el-sub-menu__title:hover) {
          background-color: rgb(71, 86, 114) !important;
        }

        &-item {
          color: #ccc;
          padding-left: 50px !important;
          background-color: rgba(0, 21, 41, 0.85);

          .el-menu--collapse & {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }

          &:hover {
            color: #fff;
            background-color: #0a60bd !important;
          }

          &.is-active {
            color: #fff !important;
            background-color: #0a60bd !important;
          }
        }
      }
    }
  }

  .main-page {
    min-height: 100vh;
    height: 100%;
    flex-direction: column;

    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333;
      height: 48px !important;
    }

    .main-page-content {
      height: calc(100% - 48px);
      // border: 3px solid red;

      .main-page-info {
        background-color: #fff;
      }
    }

    .el-main {
      background-color: #f0f2f5;
    }
  }
}
</style>
