<template>
  <div class="swipe-manage">
    <div class="title">
      <h1>轮播图管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          轮播图列表
        </span>
        <el-button type="primary" @click="addClick">
          <el-icon>
            <Plus />
          </el-icon>
          新建
        </el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="id" max-width="70" align="center" />
        <el-table-column label="图片" align="center" min-width="160">
          <template #default="scope">
            <img :src=scope.row.img alt="" height="70">
          </template>
        </el-table-column>
        <el-table-column prop="product_id" label="商品id" max-width="70" align="center" />
        <el-table-column prop="weight" label="权重" align="center" max-width="70" />

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
    <el-dialog v-model="dialogFormVisible" title="新增轮播图" width="50%" center>
      <el-form :model="swipe">
        <el-form-item label="轮播图商品" :label-width="formLabelWidth">
          <el-input v-model="swipe.product_id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="轮播图权重" :label-width="formLabelWidth">
          <el-input v-model="swipe.weight" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload ref="uploadRef1" class="upload-demo" action="" :auto-upload="false" :file-list="fileList"
            :http-request="handleFileUpload1">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitUploadImg">
              上传
            </el-button>

          </el-upload>
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
    <el-dialog v-model="editDialogVisible" title="编辑轮播图" width="50%" center>
      <el-form :model="editSwipeData">
        <el-form-item label="轮播图id" :label-width="formLabelWidth">
          <el-input v-model="editSwipeData.id" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="轮播图商品" :label-width="formLabelWidth">
          <el-input v-model="editSwipeData.product_id" autocomplete="off" />
        </el-form-item>

        <el-form-item label="权重" :label-width="formLabelWidth">
          <el-input v-model="editSwipeData.weight" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload ref="uploadRef3" class="upload-demo" action="" :auto-upload="false" :file-list="fileList"
            :http-request="handleFileUpload3">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>
            <el-button type="success" @click="submitEditImg">
              上传
            </el-button>

          </el-upload>
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
  import { getSwipeList, getProductImg, addSwipe, delSwipeById, editSwipe } from '@/request/product'
  import { onMounted, ref, reactive } from 'vue';
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
  const currentSwipeData = ref([])
  const getTableData = () => {
    getSwipeList(
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
          currentSwipeData.value = data.data
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
    // delProduct(confirmId.value)
    delSwipe(confirmId.value)
    dialogVisible.value = false
  }
  const cancelClick = () => {
    confirmId.value = 0
    dialogVisible.value = false
  }
  const delSwipe = (sid) => {
    delSwipeById(
      {
        id: sid
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
  const swipe = reactive({
    img: '',
    product_id: '',
    weight: ''
  })

  //上传
  const uploadRef1 = ref()
  const handleFileUpload1 = (myfile) => {
    console.log("file111", myfile);
    getProductImg(
      {
        file: myfile.file
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        swipe.img = data.data
        console.log("swipe.img", swipe.img);

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

  const addClick = () => {
    dialogFormVisible.value = true
    console.log("123");
  }
  const newSwipe = () => {
    addSwipe(
      {
        img: swipe.img,
        product_id: swipe.product_id,
        weight: swipe.weight

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
    newSwipe()
    dialogFormVisible.value = false
  }

  //编辑操作
  const editDialogVisible = ref(false)
  const editSwipeData = ref({})
  // const confirmEditId = ref(0)
  const handleEdit = (index, row) => {
    console.log(index, row);
    currentSwipeData.value.forEach(item => {
      if (item.id == row.id) {
        editSwipeData.value = item
      }
    })
    editDialogVisible.value = true
  }

  //编辑上传
  const uploadRef3 = ref()
  const handleFileUpload3 = (myfile) => {
    console.log("file333", myfile);
    getProductImg(
      {
        file: myfile.file
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        editSwipeData.value.img = data.data
        console.log("editSwipeData.value.img", editSwipeData.value.img);

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("发送失败");
      }
    )
  }
  const submitEditImg = () => {
    // console.log("uploadRef1", uploadRef1.value);
    // console.log("fileData", fileData.value);
    uploadRef3.value.submit()
  }


  const confirmEdit = () => {
    console.log("确定修改");
    getEditSwipe()
    console.log("editSwipeData", editSwipeData.value);
    editDialogVisible.value = false
  }

  const getEditSwipe = () => {
    editSwipe(
      {
        id: editSwipeData.value.id,
        img: editSwipeData.value.img,
        product_id: editSwipeData.value.product_id,
        weight: editSwipeData.value.weight
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
.swipe-manage {
  // height: 600px;
  // border: 1px solid red;

  .title {
    text-align: center;
    padding-top: 10px;
  }

  .table {
    margin-top: 40px;
    padding: 0 20px;

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