<template>
  <div class="admin-info">
    <div class="title">
      <h1>管理员个人信息</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          管理员列表
        </span>
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
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑dialog -->
    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="50%" center>
      <el-form :model="editUserData" label-position="right" label-width="90">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="editUserData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="editUserData.old_pwd" autocomplete="off" type="password" />
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

  </div>
</template>

<script setup>
  import { getUserDetail, editAdminInfo } from '@/request/user'
  import { onMounted, ref } from 'vue';
  import PromptMessage from '@/components/PromptMessage'


  const tableData = ref([])
  const currentUserData = ref([])
  const getTableData = () => {
    getUserDetail(
      {
        isAdmin: 1
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("获取表格数据成功");
          data.data.sex = data.data.sex == '1' ? '男' : '女'
          tableData.value.push(data.data)
          currentUserData.value.push(data.data)
          console.log("currentUserData.value", currentUserData.value);
          // tableData.value.sex = tableData.value.sex == 1 ? '男' : '女'

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
    editAdminInfo(
      {
        user_id: editUserData.value.id,
        name: editUserData.value.name,
        old_pwd: editUserData.value.old_pwd,
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
          location.reload()

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
.admin-info {
  // height: 600px;
  // border: 1px solid red;
  padding: 0 20px;
  height: 100vh;

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