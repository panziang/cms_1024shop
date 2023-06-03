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
        <el-table-column prop="id" label="id" width="60" align="center" />
        <el-table-column label="状态" width="70" align="center">
          <template #default="scope">
            {{ scope.row.publish }}
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" align="center" />
        <el-table-column prop="price" label="价格" align="center" width="70" />
        <el-table-column prop="stock" label="库存" width="100" align="center" />
        <el-table-column prop="coupon_title" label="优惠券名" align="center" />
        <el-table-column prop="user_limit" label="领取限制" width="90" align="center" />
        <el-table-column prop="start_time" label="开始时间" width="140" align="center" />
        <el-table-column prop="end_time" label="结束时间" width="140" align="center" />
        <el-table-column prop="condition_price" label="门槛" width="70" align="center" />

        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleOffline(scope.$index, scope.row)">下线</el-button>
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

    <!-- 下线dialog -->
    <el-dialog v-model="dialogOfflineVisible" title="提示" width="30%">
      <span>确定下线吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelOffline()">取消</el-button>
          <el-button type="primary" @click="confirmOffline()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

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
    <el-dialog v-model="dialogFormVisible" title="新增优惠券" width="50%" center>
      <el-form :model="coupon">
        <el-form-item label="优惠券名" :label-width="formLabelWidth">
          <el-input v-model="coupon.coupon_title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券价格" :label-width="formLabelWidth">
          <el-input v-model="coupon.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券库存" :label-width="formLabelWidth">
          <el-input v-model="coupon.publish_count" autocomplete="off" />
        </el-form-item>
        <el-form-item label="满减条件" :label-width="formLabelWidth">
          <el-input v-model="coupon.condition_price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="领取限制" :label-width="formLabelWidth">
          <el-input v-model="coupon.user_limit" autocomplete="off" />
        </el-form-item>

        <el-form-item label="优惠券分类" :label-width="formLabelWidth">
          <el-select v-model="coupon.category" class="m-2" placeholder="选择分类">
            <el-option label="促销劵" value="PROMOTION" />
            <el-option label="注册赠券" value="NEW_USER" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" :label-width="formLabelWidth">
          <el-select v-model="coupon.publish" class="m-2" placeholder="选择分类">
            <el-option label="发布" value="PUBLISH" />
            <el-option label="草稿" value="DRAFT" />
            <el-option label="下线" value="OFFLINE" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="coupon.start_time" type="date" placeholder="选择开始时间" :size="size" />
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="coupon.end_time" type="date" placeholder="选择结束时间" :size="size" />
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

    <!-- 编辑dialog -->
    <el-dialog v-model="editDialogVisible" title="编辑优惠券" width="50%" center>
      <el-form :model="editCouponData">
        <el-form-item label="优惠券名" :label-width="formLabelWidth">
          <el-input v-model="editCouponData.coupon_title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券价格" :label-width="formLabelWidth">
          <el-input v-model="editCouponData.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优惠券库存" :label-width="formLabelWidth">
          <el-input v-model="editCouponData.publish_count" autocomplete="off" />
        </el-form-item>
        <el-form-item label="满减条件" :label-width="formLabelWidth">
          <el-input v-model="editCouponData.condition_price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="领取限制" :label-width="formLabelWidth">
          <el-input v-model="editCouponData.user_limit" autocomplete="off" />
        </el-form-item>

        <el-form-item label="优惠券分类" :label-width="formLabelWidth">
          <el-select v-model="editCouponData.category" class="m-2" placeholder="选择分类">
            <el-option label="促销劵" value="PROMOTION" />
            <el-option label="注册赠券" value="NEW_USER" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" :label-width="formLabelWidth">
          <el-select v-model="editCouponData.publish" class="m-2" placeholder="选择分类">
            <el-option label="发布" value="PUBLISH" />
            <el-option label="草稿" value="DRAFT" />
            <el-option label="下线" value="OFFLINE" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="editCouponData.start_time" type="date" placeholder="选择开始时间" :size="size" />
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="editCouponData.end_time" type="date" placeholder="选择结束时间" :size="size" />
        </el-form-item>


      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
  import { getCouponList, delCouponById, addCoupon, offCoupon, changeCoupon } from '@/request/coupon'
  import { onMounted, ref, reactive } from 'vue';
  import { getResTime } from '@/utils/format_date'
  import PromptMessage from '@/components/PromptMessage'
  import { getCouponDate, getCouponCnDate } from '@/utils/format_date'

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
          couponList.value = data.data.current_data
          tableData.value = data.data.current_data
          tableData.value.forEach(item => {
            item.start_time = getCouponCnDate(item.start_time)
            item.end_time = getCouponCnDate(item.end_time)
            if (item.publish == 'PUBLISH') {
              item.publish = '上线'
            } else if (item.publish == 'DRAFT') {
              item.publish = '草稿'
            } else if (item.publish == 'OFFLINE') {
              item.publish = '下线'
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

  //下线操作
  const dialogOfflineVisible = ref(false)
  const handleOffline = (index, row) => {
    console.log(index, row);
    confirmOfflineId.value = row.id
    dialogOfflineVisible.value = true
  }
  const confirmOfflineId = ref(0)
  const confirmOffline = () => {
    console.log("confirmId.value", confirmId.value);
    offlineCoupon(confirmOfflineId.value)
    dialogOfflineVisible.value = false
  }
  const cancelOffline = () => {
    confirmId.value = 0
    dialogOfflineVisible.value = false
  }
  const offlineCoupon = (coupon_id) => {
    offCoupon(
      {
        coupon_id: coupon_id
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("下线成功");
          PromptMessage.messageSuccess('下线成功')
          getTableData()

        } else {
          console.log("下线失败");
          PromptMessage.messageWarning('下线失败')
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("下线失败");
        PromptMessage.messageBoxError('下线失败', msg)
      }
    )
  }

  //删除操作
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
    category: '', //选择
    publish: '', //选择
    publish_count: '',
    price: '',
    condition_price: '',
    start_time: '', //时间选择
    end_time: '',   //时间选择
    user_limit: ''
  })
  const addClick = () => {
    dialogFormVisible.value = true
    console.log("123");
  }

  const newCoupon = () => {
    addCoupon(
      {
        coupon_title: coupon.coupon_title,
        category: coupon.category,
        publish: coupon.publish,
        publish_count: coupon.publish_count,
        price: coupon.price,
        condition_price: coupon.condition_price,
        start_time: getCouponDate(coupon.start_time),
        end_time: getCouponDate(coupon.end_time),
        user_limit: coupon.user_limit
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
  const confirmAdd = () => {
    console.log("确定新增");
    newCoupon()
    console.log("coupon", coupon);
    dialogFormVisible.value = false
  }

  //编辑操作
  const editDialogVisible = ref(false)
  // const editCoupon = reactive({
  //   id: '',
  //   coupon_title: '',
  //   category: '', //选择
  //   publish: '', //选择
  //   publish_count: '',
  //   price: '',
  //   condition_price: '',
  //   start_time: '', //时间选择
  //   end_time: '',   //时间选择
  //   user_limit: ''
  // })
  const editCouponData = ref({})
  const confirmEditId = ref(0)
  const handleEdit = (index, row) => {
    console.log(index, row);
    editDialogVisible.value = true
    couponList.value.forEach(item => {
      if (item.id == row.id) {
        editCouponData.value = item
        editCouponData.value.start_time = item.start_time.replace(/[年月]/g, "-").replace(/日/g, "");
        editCouponData.value.end_time = item.end_time.replace(/[年月]/g, "-").replace(/日/g, "");
      }
    })
    console.log("editCouponData", editCouponData.value);
    confirmEditId.value = row.id

  }

  const confirmEdit = () => {
    //存在浅拷贝问题
    console.log("确定修改");
    getEditCoupon()
    console.log("editCouponData", editCouponData.value);
    editDialogVisible.value = false
  }
  const getEditCoupon = () => {
    changeCoupon(
      {
        id: editCouponData.value.id,
        coupon_title: editCouponData.value.coupon_title,
        category: editCouponData.value.category,
        publish: editCouponData.value.publish,
        publish_count: editCouponData.value.publish_count,
        price: editCouponData.value.price,
        condition_price: editCouponData.value.condition_price,
        start_time: getCouponDate(editCouponData.value.start_time),
        end_time: getCouponDate(editCouponData.value.end_time),
        user_limit: editCouponData.value.user_limit
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("修改成功");
          PromptMessage.messageSuccess('修改成功')
          getTableData()

        } else {
          console.log("修改失败");
          PromptMessage.messageWarning('修改失败')
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("修改失败");
        PromptMessage.messageBoxError('修改失败', msg)
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