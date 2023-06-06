<template>
  <div class="main">
    <el-container class="home-container">
      <el-aside :width="isFold ? '64px' : '200px'">
        <div class="nav-menu">
          <div class="nav-menu__logo">
            <img class="nav-menu__logo-img" src="~@/assets/img/logo.svg" alt="logo" />
            <span v-if="!isFold" class="nav-menu__logo-title">Vue3+VITE</span>
          </div>

          <el-menu class="nav-menu__menu" active-text-color="#fff" background-color="#001529" text-color="#ccc"
            :collapse="isFold" :collapse-transition="false" router>

            <el-sub-menu index="1" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <User />
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/main/user-manage" class="nav-menu__menu-item">用户管理</el-menu-item>
              <el-menu-item index="/main/admin-manage" class="nav-menu__menu-item"
                v-if="isAdmin === 1">管理员管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <Present />
                </el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/main/product-manage" class="nav-menu__menu-item">商品管理</el-menu-item>
              <el-menu-item index="/main/swipe-manage" class="nav-menu__menu-item">轮播图管理</el-menu-item>

            </el-sub-menu>

            <el-sub-menu index="3" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <Tickets />
                </el-icon>
                <span>订单管理</span>
              </template>
              <el-menu-item index="/main/order-manage" class="nav-menu__menu-item">订单管理</el-menu-item>


            </el-sub-menu>

            <el-sub-menu index="4" class="nav-menu__menu-sub">
              <template #title>
                <el-icon>
                  <Postcard />
                </el-icon>
                <span>优惠券管理</span>
              </template>
              <el-menu-item index="/main/coupon-manage" class="nav-menu__menu-item">优惠券管理</el-menu-item>


            </el-sub-menu>
          </el-menu>
        </div>
      </el-aside>

      <el-container class="main-page">
        <el-header class="main-page-header">
          <div class="nav-header">
            <div class="icon">
              <i class="nav-header-fold" @click="handleFoldClick">
                <el-icon v-show="isFold" size="27">
                  <Fold />
                </el-icon>
                <el-icon v-show="!isFold" size="27">
                  <Expand />
                </el-icon>
              </i>
            </div>

            <div class="nav-header-content">
              <!-- <img :src=userInfo.head_img alt=""> -->
              <el-avatar :src=userInfo.head_img fit="fill" />

              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-button>
                    {{ userInfo.name }}
                    <el-icon class="el-icon--right">
                      <arrow-down />
                    </el-icon>
                  </el-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="exitClick()">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </div>
          </div>
        </el-header>

        <el-main class="main-page-content">
          <div class="main-page-info">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { getUserInfo, getSignOut } from '@/request/user'
  import { useRouter } from 'vue-router';
  import PromptMessage from '@/components/PromptMessage'

  const router = useRouter()
  const isFold = ref(false)
  const handleFoldClick = () => {
    isFold.value = !isFold.value
  }
  const userInfo = ref({})
  const getUserDetail = () => {
    getUserInfo(
      {},
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("获取表格数据成功");
          userInfo.value = data.data
          if (userInfo.value.mail == '1739864725@qq.com') {
            isAdmin.value = 1
          }
        } else {
          console.log("获取表格数据失败");
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("获取表格数据失败");
        // PromptMessage.messageBoxError('登录失败', msg)
      }
    )
  }
  const exitClick = () => {
    getSignOut(
      {},
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          PromptMessage.messageSuccess('登出成功')
          console.log("成功登出");
          localStorage.removeItem('1024token')
          router.push('/log-in')

        } else {
          // PromptMessage.messageBoxError('登录失败', data.msg)
          console.log("登出失败");
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("登出失败");
      }
    )
  }
  const isAdmin = ref(0)
  onMounted(() => {
    getUserDetail()
  })
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;

  .home-container {
    height: 100%;

    .el-aside {
      min-height: 100vh;
      height: 100%;
      // background-color: @mainColor !important;
      transition: width 0.25s;

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

        .nav-header {
          display: flex;
          align-items: center;
          // justify-content: space-between;
          width: 100%;
          // background-color: pink;

          &-fold {
            cursor: pointer;
          }

          &-content {
            display: flex;
            margin-left: 10px;
            align-items: center;
            justify-content: end;
            background-color: #fff;
            flex: 1;
            margin-right: 60px;

            .el-avatar {
              margin-right: 10px;
            }

          }

          .nav-header-content {

            // border: 1px solid red;


          }

        }
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
}
</style>