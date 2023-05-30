<template>
  <div class="coupon-manage">
    <div class="title">
      <h1>优惠券管理</h1>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" max-width="70" align="center" />
        <el-table-column prop="category" label="分类" max-width="100" align="center" />
        <el-table-column prop="price" label="价格" align="center" />
        <el-table-column prop="stock" label="库存" max-width="100" align="center" />
        <el-table-column prop="coupon_title" label="优惠券名" align="center" />
        <el-table-column prop="user_limit" label="领取限制" max-width="100" align="center" />
        <el-table-column prop="start_time" label="开始时间" max-width="100" align="center" />
        <el-table-column prop="end_time" label="结束时间" max-width="100" align="center" />
        <el-table-column prop="condition_price" label="门槛" max-width="100" align="center" />

        <el-table-column label="操作" align="center" width="200">
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
  import { getCouponList } from '@/request/coupon'
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
    getCouponList(
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
.coupon-manage {
  // height: 600px;
  // margin-bottom: 50px;
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