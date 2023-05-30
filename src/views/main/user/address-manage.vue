<template>
  <div class="address-manage">
    <div class="title">
      <h1>地址管理</h1>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" max-width="60" align="center" />
        <el-table-column prop="defaultStatus" label="默认收货地址" min-width="100" align="center" />
        <el-table-column prop="receiveName" label="收货人姓名" align="center" max-width="70" />
        <el-table-column prop="phone" label="电话" width="180" align="center" />
        <el-table-column prop="province" label="省份" align="center" max-width="70" />
        <el-table-column prop="city" label="城市" align="center" max-width="70" />
        <el-table-column prop="region" label="地区" align="center" max-width="70" />
        <el-table-column prop="detailAddress" label="详细地址" align="center" width="240" />
        <el-table-column label="操作" align="center" width="240">
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
  import { getAddressList } from '@/request/user'
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
    getAddressList(
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
          tableData.value = data.data
          listCount.value = data.data.length
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
.address-manage {
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