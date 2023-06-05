<template>
  <div class="user-manage">
    <div class="title">
      <h1>用户管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          用户列表
        </span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="100" align="center" />
        <el-table-column prop="name" label="姓名" width="140" align="center" />
        <el-table-column label="头像" width="200" align="center">
          <template #default="scope">
            <img :src=scope.row.head_img alt="" height="70" fit="cover">
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
    <el-dialog v-model="editDialogVisible" title="编辑用户信息" width="50%" center>
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

  </div>
</template>

<script setup>
  import { getUserList, delUserById, editUserInfo } from '@/request/user'
  import { onMounted, ref } from 'vue';
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
        size: pageSize.value
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("获取表格数据成功");
          tableData.value = data.data.current_data
          currentUserData.value = data.data.current_data
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
    delUserById(
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
    // couponList.value.forEach(item => {
    //   if (item.id == row.id) {
    //     editCouponData.value = item
    //     editCouponData.value.start_time = item.start_time.replace(/[年月]/g, "-").replace(/日/g, "");
    //     editCouponData.value.end_time = item.end_time.replace(/[年月]/g, "-").replace(/日/g, "");
    //   }
    // })
    currentUserData.value.forEach(item => {
      if (item.id == row.id) {
        editUserData.value = item
      }
    })
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
        sex: editUserData.value.sex
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("更改用户信息成功");
          PromptMessage.messageSuccess("更改用户信息成功")
          getTableData()

        } else {
          console.log("更改用户信息失败");
          PromptMessage.messageBoxError('更改用户信息失败', data.msg)
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("更改用户信息失败");
        PromptMessage.messageBoxError('更改用户信息失败', msg)
      }
    )
  }

  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
.user-manage {
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
}
</style>