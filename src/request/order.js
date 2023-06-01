/**
 * 订单请求api
 */
import { requestPost, requestGet } from './request'

// const apiBaseURL = import.meta.env.VITE_API_BASE_URL || null
// const apiBaseURL = 'http://localhost:9000/user-server/api'
const apiBaseURL = '/order-server'

/**
 * 查询xxxx数据
 * @param {*} param
 * @param {*} successResponse function(status, res, data)
 * @param {*} errorResponse function(status, error, msg)
 */
// export function getInfoList(param, successResponse, errorResponse) {
//   requestGet('/home/info_list/xxxxxx', param, apiBaseURL, successResponse, errorResponse)
// }

//获取订单列表
export function getOrderList (param, successResponse, errorResponse) {
  requestGet('/api/order/v1/page', param, apiBaseURL, successResponse, errorResponse)
}

//删除订单项
export function delOrderById (param, successResponse, errorResponse) {
  requestGet('/api/order/v1/delete', param, apiBaseURL, successResponse, errorResponse)
}










