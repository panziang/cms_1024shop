/**
 * 首页数据请求api
 */
import { requestPost, requestGet } from './request'

// const apiBaseURL = import.meta.env.VITE_API_BASE_URL || null
// const apiBaseURL = 'http://localhost:9000/user-server/api'
const apiBaseURL = '/user-server'

/**
 * 查询xxxx数据
 * @param {*} param
 * @param {*} successResponse function(status, res, data)
 * @param {*} errorResponse function(status, error, msg)
 */
// export function getInfoList(param, successResponse, errorResponse) {
//   requestGet('/home/info_list/xxxxxx', param, apiBaseURL, successResponse, errorResponse)
// }

//获取用户列表
export function getUserList (param, successResponse, errorResponse) {
  requestGet('/api/user/v1/page', param, apiBaseURL, successResponse, errorResponse)
}

//获取收货地址列表
export function getAddressList (param, successResponse, errorResponse) {
  requestGet('/api/address/v1/list', param, apiBaseURL, successResponse, errorResponse)
}










