/**
 * 商品请求api
 */
import { requestPost, requestGet, requestUpload } from './request'

// const apiBaseURL = import.meta.env.VITE_API_BASE_URL || null
// const apiBaseURL = 'http://localhost:9000/user-server/api'
const apiBaseURL = '/product-server'

/**
 * 查询xxxx数据
 * @param {*} param
 * @param {*} successResponse function(status, res, data)
 * @param {*} errorResponse function(status, error, msg)
 */
// export function getInfoList(param, successResponse, errorResponse) {
//   requestGet('/home/info_list/xxxxxx', param, apiBaseURL, successResponse, errorResponse)
// }

//获取商品列表
export function getProductList (param, successResponse, errorResponse) {
  requestGet('/api/product/v1/page_product_list', param, apiBaseURL, successResponse, errorResponse)
}

//上传商品图片
export function getProductImg (param, successResponse, errorResponse) {
  requestUpload('/api/product/v1/upload_image', param, apiBaseURL, successResponse, errorResponse)
}

//添加商品
export function addProduct (param, successResponse, errorResponse) {
  requestPost('/api/product/v1/add_product', param, apiBaseURL, successResponse, errorResponse)
}


//删除指定商品
export function delProductById (param, successResponse, errorResponse) {
  requestGet('/api/product/v1/delete_product', param, apiBaseURL, successResponse, errorResponse)
}

//更新商品信息
export function editProduct (param, successResponse, errorResponse) {
  requestPost('/api/product/v1/update_product', param, apiBaseURL, successResponse, errorResponse)
}

//指定商品详情
export function getProductById (param, successResponse, errorResponse) {
  requestGet(`/api/product/v1/detail/${param.pid}`, param, apiBaseURL, successResponse, errorResponse)
}

//获取轮播图列表
export function getSwipeList (param, successResponse, errorResponse) {
  requestGet('/api/banner/v1/list', param, apiBaseURL, successResponse, errorResponse)
}

//删除轮播图
export function delSwipeById (param, successResponse, errorResponse) {
  requestGet('/api/banner/v1/delete', param, apiBaseURL, successResponse, errorResponse)
}

//新增轮播图
export function addSwipe (param, successResponse, errorResponse) {
  requestPost('/api/banner/v1/add', param, apiBaseURL, successResponse, errorResponse)
}

//修改轮播图信息
export function editSwipe (param, successResponse, errorResponse) {
  requestPost('/api/banner/v1/update', param, apiBaseURL, successResponse, errorResponse)
}














