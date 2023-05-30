<template>
  <div class="user-manage">
    <div class="title">
      <h1>用户管理</h1>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="140" align="center" />
        <el-table-column prop="name" label="姓名" width="180" align="center" />
        <el-table-column prop="sex" label="性别" align="center" max-width="70" />
        <el-table-column prop="mail" label="邮箱" width="240" align="center" />
        <el-table-column prop="slogan" label="个性签名" align="center" width="300" />
        <el-table-column label="操作" align="center" width="300">
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

  </div>
</template>

<script setup>
  import { getUserList } from '@/request/user'
  import { onMounted, ref } from 'vue';

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
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
.user-manage {
  // height: 600px;
  // border: 1px solid red;

  .title {
    text-align: center;
    padding-top: 10px;
  }

  .table {
    margin-top: 80px;
  }

  .pagination {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }
}
</style>