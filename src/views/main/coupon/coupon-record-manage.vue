<template>
  <div class="coupon-manage">
    <div class="title">
      <h1>优惠券领取记录管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          优惠券领取记录列表
        </span>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="60" align="center" />

        <el-table-column label="状态" prop="use_state" width="70" align="center" :filters="[
          { text: '可用', value: '可用' },
          { text: '已使用', value: '已使用' },
          { text: '过期', value: '过期' }
        ]" :filter-method="filterHandler">

        </el-table-column>
        <el-table-column prop="coupon_id" label="优惠券ID" width="120" align="center" />
        <el-table-column prop="price" label="价格" align="center" width="70" />
        <el-table-column prop="user_id" label="用户ID" width="100" align="center" />
        <el-table-column prop="coupon_title" label="优惠券名" align="center" />
        <el-table-column prop="user_name" label="用户名" width="90" align="center" />
        <el-table-column prop="start_time" label="开始时间" width="140" align="center" />
        <el-table-column prop="end_time" label="结束时间" width="140" align="center" />
        <el-table-column prop="condition_price" label="门槛" width="70" align="center" />

        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
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
  </div>
</template>

<script setup>
  import { getCouponRecord, delCouponRecordById } from '@/request/coupon'
  import { onMounted, ref } from 'vue';

  import PromptMessage from '@/components/PromptMessage'
  import { getCouponCnDate } from '@/utils/format_date'

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
  const couponList = ref([])
  const getTableData = () => {
    getCouponRecord(
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
          couponList.value = data.data.current_data
          tableData.value = data.data.current_data
          tableData.value.forEach(item => {
            item.start_time = getCouponCnDate(item.start_time)
            item.end_time = getCouponCnDate(item.end_time)
            if (item.use_state == 'NEW') {
              item.use_state = '可用'
            } else if (item.use_state == 'USED') {
              item.use_state = '已使用'
            } else if (item.use_state == 'EXPIRED') {
              item.use_state = '过期'
            }
          })
          listCount.value = data.data.total_record
        } else {
          PromptMessage.messageBoxError('获取表格数据失败', data.msg)
          console.log("获取表格数据失败");
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("获取表格数据失败");
        PromptMessage.messageBoxError('获取表格数据失败', msg)
      }
    )
  }

  const filterHandler = (value, row, column) => {
    const property = column['property']
    return row[property] === value
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
    delCoupon(confirmId.value)
    dialogVisible.value = false
  }
  const cancelClick = () => {
    confirmId.value = 0
    dialogVisible.value = false
  }
  const delCoupon = (cid) => {
    delCouponRecordById(
      {
        coupon_record_id: cid
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
.coupon-manage {
  // height: 600px;
  // margin-bottom: 50px;
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