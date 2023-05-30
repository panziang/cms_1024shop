/**
 * 登录请求api
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

//管理员登录
export function getAdminLogin (param, successResponse, errorResponse) {
  requestPost('/api/user/v1/login_by_password_admin', param, apiBaseURL, successResponse, errorResponse)
}










