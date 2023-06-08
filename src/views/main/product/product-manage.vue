<template>
  <div class="product-manage">
    <div class="title">
      <h1>商品管理</h1>
    </div>
    <div class="table">
      <div class="table-header">
        <span>
          商品列表
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
        <el-table-column prop="title" label="商品名" width="200" align="center" />
        <el-table-column label="商品图" align="center" min-width="160">
          <template #default="scope">
            <!-- <img :src=scope.row.cover_img alt="" height="70"> -->
            <el-image style=" height: 100px" :src=scope.row.cover_img :zoom-rate="1.2"
              :preview-src-list=[scope.row.cover_img] :initial-index="0" fit="cover" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column label="详情" align="center" min-width="160">
          <template #default="scope">
            <!-- <img :src=scope.row.detail alt="" height="70"> -->
            <el-image style=" height: 100px" :src=scope.row.detail :zoom-rate="1.2" :preview-src-list=[scope.row.detail]
              :initial-index="0" fit="cover" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" max-width="100" align="center" />
        <el-table-column prop="old_price" label="原价" max-width="100" align="center" />
        <el-table-column prop="stock" label="库存" align="center" max-width="70" />

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
    <el-dialog v-model="dialogFormVisible" title="新增商品" width="50%" center>
      <el-form :model="product">
        <el-form-item label="商品名" :label-width="formLabelWidth">
          <el-input v-model="product.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="product.price" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品原价" :label-width="formLabelWidth">
          <el-input v-model="product.old_price" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input v-model="product.stock" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload ref="uploadRef1" class="upload-demo" action="" :auto-upload="false" :file-list="fileList"
            :http-request="handleFileUpload1" list-type="picture">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitUploadImg">
              上传
            </el-button>

          </el-upload>
        </el-form-item>

        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <el-upload ref="uploadRef2" class="upload-demo" action="" :auto-upload="false" :http-request="handleFileUpload2"
            list-type="picture">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitUploadDetail">
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
    <el-dialog v-model="editDialogVisible" title="编辑商品" width="50%" center>
      <el-form :model="editProductData">
        <el-form-item label="商品名" :label-width="formLabelWidth">
          <el-input v-model="editProductData.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="editProductData.price" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品原价" :label-width="formLabelWidth">
          <el-input v-model="editProductData.old_price" autocomplete="off" />
        </el-form-item>

        <el-form-item label="商品库存" :label-width="formLabelWidth">
          <el-input v-model="editProductData.stock" autocomplete="off" />
        </el-form-item>
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <el-upload ref="uploadRef3" class="upload-demo" action="" :auto-upload="false" :file-list="fileList"
            :http-request="handleFileUpload3" list-type="picture">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitEditImg">
              上传
            </el-button>

          </el-upload>
        </el-form-item>

        <el-form-item label="商品详情" :label-width="formLabelWidth">
          <el-upload ref="uploadRef4" class="upload-demo" action="" :auto-upload="false" :http-request="handleFileUpload4"
            list-type="picture">
            <template #trigger>
              <el-button type="primary" style="margin-right: 30px;">选择文件</el-button>
            </template>

            <el-button type="success" @click="submitEditDetail">
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
  import { getProductList, delProductById, addProduct, getProductImg, getProductById, editProduct } from '@/request/product'
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
  const getTableData = () => {
    getProductList(
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
    delProduct(confirmId.value)
    dialogVisible.value = false
  }
  const cancelClick = () => {
    confirmId.value = 0
    dialogVisible.value = false
  }
  const delProduct = (pid) => {
    delProductById(
      {
        product_id: pid
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
  const product = reactive({
    title: '',
    cover_img: '',
    detail: '',
    price: '',
    old_price: '',
    stock: ''
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
        product.cover_img = data.data
        PromptMessage.messageSuccess('上传成功')
        console.log("product.cover_img", product.cover_img);

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

  const uploadRef2 = ref()
  const handleFileUpload2 = (myfile) => {
    console.log("file222", myfile);
    getProductImg(
      {
        file: myfile.file
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        product.detail = data.data
        PromptMessage.messageSuccess('上传成功')
        console.log("product.detail", product.detail);

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("发送失败");
      }
    )
  }
  const submitUploadDetail = () => {
    console.log("uploadRef2", uploadRef2.value);
    uploadRef2.value.submit()
  }
  const addClick = () => {
    dialogFormVisible.value = true
    console.log("123");
  }
  const newProduct = () => {
    addProduct(
      {
        title: product.title,
        price: product.price,
        old_price: product.old_price,
        stock: product.stock,
        cover_img: product.cover_img,
        detail: product.detail,
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
    newProduct()
    dialogFormVisible.value = false
  }

  //编辑操作
  const editDialogVisible = ref(false)
  const editProductData = ref({})
  // const confirmEditId = ref(0)
  const handleEdit = (index, row) => {
    console.log(index, row);
    getProductInfo(row.id)
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
        editProductData.value.cover_img = data.data
        PromptMessage.messageSuccess('上传成功')
        console.log("editProductData.value.cover_img", editProductData.value.cover_img);

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

  const uploadRef4 = ref()
  const handleFileUpload4 = (myfile) => {
    console.log("file444", myfile);
    getProductImg(
      {
        file: myfile.file
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)
        editProductData.value.detail = data.data
        PromptMessage.messageSuccess('上传成功')
        console.log("editProductData.value.detail", editProductData.value.detail);

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("发送失败");
      }
    )
  }
  const submitEditDetail = () => {
    console.log("uploadRef4", uploadRef2.value);
    uploadRef4.value.submit()
  }

  const confirmEdit = () => {
    console.log("确定修改");
    getEditProduct()
    console.log("editProductData", editProductData.value);
    editDialogVisible.value = false
  }

  const getEditProduct = () => {
    editProduct(
      {
        product_id: editProductData.value.id,
        title: editProductData.value.title,
        detail: editProductData.value.detail,
        price: editProductData.value.price,
        stock: editProductData.value.stock,
        cover_img: editProductData.value.cover_img
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


  //获取编辑时对应的商品信息
  const getProductInfo = (pid) => {
    getProductById(
      {
        pid: pid
      },
      (status, res, data) => {
        console.log('status: ', status)
        console.log('res: ', res)
        console.log('data: ', data)

        if (data.code == '0') {
          console.log("查找成功");
          editProductData.value = data.data
          // PromptMessage.messageSuccess('查找成功')

        } else {
          console.log("查找失败");
          PromptMessage.messageWarning('查找失败')
        }

      },
      (status, error, msg) => {
        console.log('status: ', status)
        console.log('error: ', error)
        console.log('msg: ', msg)
        console.log("查找失败");
        PromptMessage.messageBoxError('查找失败', msg)
      }
    )
  }
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
.product-manage {
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