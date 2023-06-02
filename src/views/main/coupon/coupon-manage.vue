<template>
  <div class="coupon-manage">
    <div class="title">
      <h1>优惠券管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          优惠券列表
        </span>
        <el-button type="primary" @click="addClick">
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" width="70" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            {{ scope.row.publish }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" align="center" />
        <el-table-column prop="price" label="价格" align="center" width="80" />
        <el-table-column prop="stock" label="库存" width="100" align="center" />
        <el-table-column prop="coupon_title" label="优惠券名" align="center" />
        <el-table-column prop="user_limit" label="领取限制" width="90" align="center" />
        <el-table-column prop="start_time" label="开始时间" width="140" align="center" />
        <el-table-column prop="end_time" label="结束时间" width="140" align="center" />
        <el-table-column prop="condition_price" label="门槛" width="80" align="center" />

        <el-table-column label="操作" align="center" width="180">
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

    <!-- 新增dialog -->
    <el-dialog v-model="dialogFormVisible" title="新增商品" width="50%" center>
      <el-form :model="coupon">
        <el-form-item label="优惠券名" :label-width="formLabelWidth">
          <el-input v-model="coupon.coupon_title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券价格" :label-width="formLabelWidth">
          <el-input v-model="coupon.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券库存" :label-width="formLabelWidth">
          <el-input v-model="coupon.stock" autocomplete="off" />
        </el-form-item>


      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
  import { getCouponList, delCouponById } from '@/request/coupon'
  import { onMounted, ref, reactive } from 'vue';
  import { getResTime } from '@/utils/format_date'
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
          tableData.value.forEach(item => {
            item.start_time = getResTime(item.start_time)
            item.end_time = getResTime(item.end_time)
            if (item.publish == 'PUBLISH') {
              item.publish = '上线'
            } else if (item.publish == 'DRAFT') {
              item.publish = '草稿'
            } else if (item.publish == 'OFFLINE') {
              item.publish = '过期'
            }
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

  const dialogVisible = ref(false)
  const handleDelete = (index, row) => {
    console.log(index, row);
    confirmId.value = row.id
    dialogVisible.value = true
  }
  const confirmId = ref(0)
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
    delCouponById(
      {
        cid: cid
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

  //新增操作
  const dialogFormVisible = ref(false)
  const formLabelWidth = '140px'
  const coupon = reactive({
    coupon_title: '',
    category: '',
    publish: '',
    price: '',
    stock: ''
  })
  const addClick = () => {
    dialogFormVisible.value = true
    console.log("123");
  }

  const confirmAdd = () => {
    console.log("确定新增");
    // newProduct()
    dialogFormVisible.value = false
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