<template>
  <div class="login container">
    <div class="mask">
      <el-row>
        <el-col :span="24">
          <div class="login-form">
            <div class="login-signup-header">

              <span class="header-title">1024shop后台管理系统</span>
            </div>
            <el-tabs type="border-card" v-model="myTabs">
              <el-tab-pane label="免密登录" name="1">
                <el-form ref="loginCodeFormRef" label-position="top" label-width="100px" :model="loginForm"
                  style="max-width: 460px" :rules="rules" @keydown.enter="submitFormByCode(loginCodeFormRef)">

                  <el-form-item label="邮箱号" prop="email">
                    <el-input v-model="loginForm.email" placeholder="请输入邮箱号" />
                  </el-form-item>

                  <el-form-item label="图形验证码">
                    <el-input v-model="loginForm.kaptcha" placeholder="请输入图形验证码" />
                    <img :src=kaptcha alt="" style="margin-top: 5px;">
                  </el-form-item>

                  <el-form-item label="验证码" class="code" prop="code">
                    <div class="code-item">
                      <el-input v-model="loginForm.code" placeholder="请输入验证码" class="code-input" />
                      <el-button class="code-btn" @click="getCode" :disabled="codeDisabled">{{ codeText }}</el-button>
                    </div>
                  </el-form-item>
                  <div class="login-btn">
                    <el-button @click="submitFormByCode(loginCodeFormRef)">登录/注册</el-button>
                  </div>

                </el-form>
              </el-tab-pane>
              <el-tab-pane label="密码登录" name="2">
                <el-form ref="loginPwdFormRef" label-position="top" label-width="100px" :model="loginForm"
                  style="max-width: 460px" :rules="rules" @keydown.enter="submitFormByPwd(loginPwdFormRef)">

                  <el-form-item label="账号" prop="account">
                    <el-input v-model="loginForm.account" placeholder="手机号/用户名/邮箱" />
                  </el-form-item>

                  <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
                  </el-form-item>

                  <div class="login-btn">
                    <el-button @click="submitFormByPwd(loginPwdFormRef)">登录</el-button>
                  </div>

                </el-form>

              </el-tab-pane>
            </el-tabs>

          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getAdminLogin, sendKaptcha, getSignCode } from '../../request/login'
  import PromptMessage from '../../components//PromptMessage'

  const myTabs = ref('2')

  const loginPwdFormRef = ref()
  const loginCodeFormRef = ref()
  const loginForm = reactive({
    email: '',
    account: '',
    password: '',
    code: '',
    kaptcha: ''
  })
  const router = useRouter()

  //验证表单
  const checkAccount = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('账号不能为空！'))
    } else {
      let finalCheckAccount = /^([\w.-]+@[\w.-]+\.[a-zA-Z]{2,6})$|^((1[3456789]\d{9}))$|^([a-zA-Z][a-zA-Z0-9]{2,15})$/
      let checkVal = finalCheckAccount.test(value)
      if (!checkVal) {
        return callback(new Error('账号格式错误！'))
      }
      else {
        callback()
      }
    }
  }
  const checkEmail = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('邮箱号不能为空！'))
    } else {
      let finalCheckEmail = /^([\w.-]+@[\w.-]+\.[a-zA-Z]{2,6})$/
      let checkVal = finalCheckEmail.test(value)
      if (!checkVal) {
        return callback(new Error('邮箱号格式错误！'))
      }
      else {
        callback()
      }
    }
  }
  const checkCode = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入验证码！'))
    } else {
      let finalCheckCode = /^\d{6}$/
      let checkVal = finalCheckCode.test(value)
      if (!checkVal) {
        return callback(new Error('验证码格式错误！'))
      }
      else {
        callback()
      }
    }
  }
  const validatePass = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('密码不能为空！'))
    }
    callback()
    // else {
    //   let finalCheckPwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/
    //   let checkPwd = finalCheckPwd.test(value)
    //   if (!checkPwd) {
    //     return callback(new Error('密码必须由大小写字母和数字组成且长度在6~16之间！'))
    //   }
    //   else {
    //     callback()
    //   }
    // }
  }
  const rules = reactive({
    email: [{ validator: checkEmail, trigger: 'blur' }],
    account: [{ validator: checkAccount, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
    code: [{ validator: checkCode, trigger: 'blur' }],
  })
  //发送密码登录请求
  const signInByPwd = () => {
    console.log("signIn~");
    getAdminLogin(
      {
        mail: loginForm.account,
        pwd: loginForm.password,
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          PromptMessage.messageSuccess('登录成功')
          let token = data.data
          localStorage.setItem('1024token', token);
          router.push('/main')
        } else {
          PromptMessage.messageBoxError('登录失败', data.msg)
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        PromptMessage.messageBoxError('登录失败', msg)
      }
    )
  }
  //提交表单 密码登录
  const submitFormByPwd = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        signInByPwd()
        console.log('submit!')
      } else {
        console.log('error submit!')
        PromptMessage.messageError('登录失败')
        return false
      }
    })
  }

  //验证码
  const codeText = ref('发送验证码')
  const codeDisabled = ref(false)
  const getCode = () => {
    loginCodeFormRef.value.validateField('email', (res) => {
      if (res) {
        getSignCode(
          {
            kaptcha: loginForm.kaptcha,
            to: loginForm.email
          },
          (status, res, data) => {
            console.log('status: ', status)
            console.log('res: ', res)
            console.log('data: ', data)
            if (data.code == '0') {
              PromptMessage.messageSuccess("发送成功")
              tackBtn()
            } else {
              console.log("发送失败");
              PromptMessage.messageError('发送失败' + data.msg)
            }

          },
          (status, error, msg) => {
            console.log('status: ', status)
            console.log('error: ', error)
            console.log('msg: ', msg)
            console.log("发送失败");
            PromptMessage.messageError('发送失败' + msg)
          }
        )

      }
      else {
        PromptMessage.messageError('请输入正确邮箱号')
        return
      }
    })
    console.log("getCode");

  }
  const tackBtn = () => {
    let time = 60;
    let timer = setInterval(() => {
      if (time == 0) {
        clearInterval(timer);
        codeText.value = '获取验证码';
        codeDisabled.value = false;
      } else {
        codeDisabled.value = true;
        codeText.value = time + '秒后重试';
        time--;
      }
    }, 1000);
  }

  //获取图形验证码
  const kaptcha = ref({})
  const getKaptcha = () => {
    sendKaptcha(
      {},
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        // const imgurl = URL.createObjectURL(data)
        kaptcha.value = URL.createObjectURL(data)

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("发送失败");
      }
    )
  }
  onMounted(() => {
    getKaptcha()
  })

</script>

<style lang="less" scoped>
.container {
  max-width: 100%;
}

.login {
  background: url('../../assets/img/login.png')no-repeat center center / cover;

  .mask {
    background-color: rgba(13, 40, 95, 0.8);
    height: 100%;

    .el-row {
      .el-col {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .login-form {
          background-color: rgb(250, 250, 250);
          width: 520px;
          padding: 20px 50px;
          padding-bottom: 30px;

          .login-signup-header {

            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;

            .header-title {
              font-weight: 700;
              color: #363636;
              font-size: 28px;
            }
          }

          .el-tabs {
            :deep(.el-tabs__header) {
              background-color: rgb(245, 245, 245);
              // border: 1px solid red;

              .el-tabs__nav-scroll {
                border: none;

                .el-tabs__nav {
                  // background-color: #fff;
                  height: 60px;
                  line-height: 60px;
                  width: 100%;

                  .el-tabs__active-bar {
                    background-color: rgb(59, 188, 167);
                  }

                  .el-tabs__item {
                    height: 60px;
                    width: 100%;
                    color: #072f60;
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 28px;
                    // background-color: #fff;
                  }
                }
              }
            }

            .el-form {
              .el-form-item {
                .el-input {
                  height: 40px;
                }

              }

              .code {

                .code-item {
                  width: 100%;
                  display: flex;
                  justify-content: space-between;

                }

                .code-btn {
                  // width: 80px;
                  height: 40px;
                  margin-left: 5px;
                }
              }

              .login-btn {
                .el-button {
                  width: 100%;
                  margin-top: 10px;
                  background-color: rgb(9, 72, 179);
                  color: #fff;
                  height: 40px;
                }
              }
            }
          }

        }
      }
    }
  }
}
</style>
