<template>
  <div class="order-manage">
    <div class="title">
      <h1>订单管理</h1>
    </div>
    <div class="table">
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="70" align="center" />
        <el-table-column prop="state" label="状态" width="100" align="center" />
        <el-table-column prop="nickname" label="昵称" align="center" min-width="70" />
        <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
        <el-table-column prop="total_price" label="总价" align="center" width="70" />
        <el-table-column prop="pay_price" label="支付价格" width="90" align="center" />
        <el-table-column label="收货信息" align="center" min-width="200">
          <!-- addressInfo.value = `${addressData.value
            .province} ${addressData.value.city} ${addressData.value.region} ${addressData.value.detailAddress}` -->
          <template #default="scope">
            {{ scope.row.receiver_address }}
          </template>
        </el-table-column>
        <el-table-column prop="del" label="删除状态" width="90" align="center" />
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
              :disabled=scope.row.del>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination :current-page=currentPage :page-size=pageSize :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper" :total=listCount @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

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
  </div>
</template>

<script setup>
  import { getOrderList, delOrderById } from '@/request/order'
  import { onMounted, ref } from 'vue';
  import { getResTime } from '@/utils/format_date'
  import PromptMessage from '@/components/PromptMessage'

  //分页数据
  let currentPage = ref(1)
  let listCount = ref(0)
  let pageSize = ref(20)
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
    getOrderList(
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
          tableData.value.forEach(item => {
            item.receiver_address = JSON.parse(item.receiver_address)
            item.receiver_address = `${item.receiver_address.receiveName} ${item.receiver_address.phone} ${item.receiver_address.province}${item.receiver_address.city}${item.receiver_address.region}${item.receiver_address.detailAddress}`
            item.state = item.state == 'PAY' ? '已支付' : '已取消'
            item.create_time = getResTime(item.create_time)
          })
          console.log("tableData.value", tableData.value);
          listCount.value = data.data.total_records
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

  const dialogVisible = ref(false)
  const handleDelete = (index, row) => {
    console.log(index, row);
    confirmId.value = row.out_trade_no
    dialogVisible.value = true
  }
  const confirmId = ref('')
  const confirmDel = () => {
    console.log("confirmId.value", confirmId.value);
    delOrder(confirmId.value)
    dialogVisible.value = false
  }
  const cancelClick = () => {
    confirmId.value = ''
  }
  const delOrder = (oid) => {
    delOrderById(
      {
        out_trade_no: oid
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

  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
.order-manage {
  // height: 1000px;
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
    // border: 1px solid red;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    padding-bottom: 50px;
  }
}
</style>