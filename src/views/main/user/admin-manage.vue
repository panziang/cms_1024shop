<template>
  <div class="admin-manage">
    <div class="title">
      <h1>管理员管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          管理员列表
        </span>
        <el-button type="primary" @click="addClick">
          <el-icon>
            <Plus />
          </el-icon>
          新建
        </el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="100" align="center" />
        <el-table-column prop="name" label="姓名" width="140" align="center" />
        <el-table-column label="头像" width="200" align="center">
          <template #default="scope">
            <!-- <img :src=scope.row.head_img alt="" height="70" fit="cover"> -->
            <el-image style=" height: 70px" :src=scope.row.head_img :zoom-rate="1.2"
              :preview-src-list=[scope.row.head_img] :initial-index="0" fit="cover" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center" max-width="50" />
        <el-table-column prop="mail" label="邮箱" width="220" align="center" />
        <el-table-column prop="slogan" label="个性签名" align="center" max-width="300" />
        <el-table-column label="操作" align="center" max-width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :current-page=currentPage :page-size=pageSize :page-sizes="[10, 20, 30, 40]" :small="small"
        :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total=listCount
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 删除dialog -->
    <el-dialog v-model="dialogVisible" title="提示" width="30%">
      <span>确定删除吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmDel()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑dialog -->
    <el-dialog v-model="editDialogVisible" title="编辑管理员信息" width="50%" center>
      <el-form :model="editUserData" label-position="right" label-width="90">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editUserData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth">
          <el-input v-model="editUserData.new_pwd" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="个性签名" :label-width="formLabelWidth">
          <el-input v-model="editUserData.slogan" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-select v-model="editUserData.sex" class="m-2" placeholder="选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>


      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增dialog -->
    <el-dialog v-model="newDialogVisible" title="新增管理员" width="50%" center>
      <el-form :model="admin" ref="newAdminRef">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="admin.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="admin.pwd" autocomplete="off" type="password" />
        </el-form-item>

        <el-form-item label="用户性别" :label-width="formLabelWidth">
          <el-select v-model="admin.sex" class="m-2" placeholder="选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="个性签名" :label-width="formLabelWidth">
          <el-input v-model="admin.slogan" autocomplete="off" />
        </el-form-item>

        <el-form-item label="邮箱号" :label-width="formLabelWidth">
          <el-input v-model="admin.mail" autocomplete="off" />
        </el-form-item>
        <el-form-item label="图像验证码" :label-width="formLabelWidth">
          <el-input v-model="kaptchaCode" autocomplete="off" />
          <img :src=kaptcha alt="">
        </el-form-item>

        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload ref="uploadRef1" class="upload-demo" action="" :auto-upload="false" :file-list="fileList"
            :http-request="handleFileUpload1" list-type="picture">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitUploadImg">
              上传
            </el-button>

          </el-upload>
        </el-form-item>

        <el-form-item label="验证码" class="code" :label-width="formLabelWidth">
          <div class="code-item">
            <el-input v-model="admin.code" placeholder="请输入验证码" class="code-input" />
            <el-button class="code-btn" @click="getCode" :disabled="codeDisabled">{{ codeText
            }}</el-button>
          </div>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="newDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
  import { getUserList, editUserInfo, getSignCode, sendKaptcha, signUpAdmin, getAvatar, delAdminById } from '@/request/user'
  import { onMounted, reactive, ref } from 'vue';
  import PromptMessage from '@/components/PromptMessage'

  //分页数据
  let currentPage = ref(1)
  let listCount = ref(0)
  let pageSize = ref(10)
  //改变size
  const handleSizeChange = (val) => {
    // console.log(`${val} items per page`)
    pageSize.value = val
    getTableData()
  }
  //改变页数
  const handleCurrentChange = (val) => {
    // console.log(`current page: ${val}`)
    currentPage.value = val
    getTableData()
  }

  const tableData = ref([])
  const currentUserData = ref([])
  const getTableData = () => {
    getUserList(
      {
        page: currentPage.value,
        size: pageSize.value,
        isAdmin: 1
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("获取表格数据成功");
          tableData.value = data.data.current_data
          currentUserData.value = data.data.current_data
          console.log("currentUserData.value", currentUserData.value);
          tableData.value.forEach(item => {
            item.sex = item.sex == 1 ? '男' : '女'
          })
          listCount.value = data.data.total_record
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

  //新增操作
  const newDialogVisible = ref(false)
  const newAdminRef = ref()
  const formLabelWidth = '140px'
  const admin = reactive({
    user_id: '',
    name: '',
    pwd: '',
    slogan: '',
    sex: '',
    mail: '',
    head_img: '',
    code: ''
  })
  const addClick = () => {
    newDialogVisible.value = true
    console.log("123");
    getKaptcha()
  }

  const uploadRef1 = ref()
  const handleFileUpload1 = (myfile) => {
    console.log("file111", myfile);
    getAvatar(
      {
        file: myfile.file
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        admin.head_img = data.data
        PromptMessage.messageSuccess('上传成功')
        console.log("admin.head_img", admin.head_img);

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("发送失败");
      }
    )
  }
  const submitUploadImg = () => {
    // console.log("uploadRef1", uploadRef1.value);
    // console.log("fileData", fileData.value);
    uploadRef1.value.submit()
  }

  //验证码
  const codeText = ref('发送验证码')
  const codeDisabled = ref(false)
  const getCode = () => {
    newAdminRef.value.validateField('mail', (res) => {
      if (res) {
        getSignCode(
          {
            kaptcha: kaptchaCode.value,
            to: admin.mail
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
  const kaptchaCode = ref('')
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

  const newAdmin = () => {
    signUpAdmin(
      {
        code: admin.code,
        head_img: admin.head_img,
        mail: admin.mail,
        name: admin.name,
        pwd: admin.pwd,
        sex: admin.sex,
        slogan: admin.slogan
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("新增成功");
          PromptMessage.messageSuccess('新增成功')
          getTableData()

        } else {
          console.log("新增失败");
          PromptMessage.messageWarning('新增失败')
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("新增失败");
        PromptMessage.messageBoxError('新增失败', msg)
      }
    )
  }
  //确认新增
  const confirmAdd = () => {
    newAdmin()
    newDialogVisible.value = false
  }

  //删除操作
  const dialogVisible = ref(false)
  const confirmId = ref(0)
  const handleDelete = (index, row) => {
    console.log(index, row);
    confirmId.value = row.id
    dialogVisible.value = true
  }

  const confirmDel = () => {
    console.log("confirmId.value", confirmId.value);
    // delProduct(confirmId.value)
    delUser(confirmId.value)
    dialogVisible.value = false
  }
  const cancelClick = () => {
    confirmId.value = 0
    dialogVisible.value = false
  }

  const delUser = (uid) => {
    delAdminById(
      {
        user_id: uid
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("删除成功");
          PromptMessage.messageSuccess('删除成功')
          getTableData()

        } else {
          console.log("删除失败");
          PromptMessage.messageWarning('删除失败')
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("删除失败");
        PromptMessage.messageBoxError('删除失败', msg)
      }
    )
  }

  //编辑操作
  const editDialogVisible = ref(false)
  const editUserData = ref({})
  const handleEdit = (index, row) => {
    console.log(index, row);
    editDialogVisible.value = true
    currentUserData.value.forEach(item => {
      if (item.id == row.id) {
        editUserData.value = item
      }
    })
    editUserData.value.sex = editUserData.value.sex == '男' ? '1' : '0'
    console.log("editUserData", editUserData.value);
  }

  const confirmEdit = () => {
    //存在浅拷贝问题
    console.log("确定修改");
    getEditUser()
    console.log("editUserData", editUserData.value);
    editDialogVisible.value = false
  }
  const getEditUser = () => {
    editUserInfo(
      {
        user_id: editUserData.value.id,
        name: editUserData.value.name,
        new_pwd: editUserData.value.new_pwd,
        slogan: editUserData.value.slogan,
        sex: editUserData.value.sex,
        is_admin: 1
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("更改管理员信息成功");
          PromptMessage.messageSuccess("更改管理员信息成功")
          getTableData()

        } else {
          console.log("更改管理员信息失败");
          PromptMessage.messageBoxError('更改管理员信息失败', data.msg)
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("更改管理员信息失败");
        PromptMessage.messageBoxError('更改管理员信息失败', msg)
      }
    )
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
.admin-manage {
  // height: 600px;
  // border: 1px solid red;
  padding: 0 20px;

  .title {
    text-align: center;
    padding-top: 10px;
  }

  .table {
    margin-top: 80px;

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;

      span {
        padding-bottom: 6px;
        padding-right: 12px;
        border-bottom: 3px solid #79bbff;
        font-size: 20px;
      }
    }
  }

  .pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }

  .el-form {

    .el-form-item {
      // border: 1px solid red;
      max-width: 500px;
    }

    .code {

      .code-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        // height: 40px;

      }

      .code-btn {
        // width: 80px;
        // height: 30px;
        margin-left: 5px;
      }
    }
  }
}
</style>