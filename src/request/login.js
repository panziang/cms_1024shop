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
//获取图形验证码
export function sendKaptcha (param, successResponse, errorResponse) {
  requestGet('/api/notify/v1/get_kaptcha', param, apiBaseURL, successResponse, errorResponse)
}

// 邮箱、手机号验证码发送
export function getSignCode (param, successResponse, errorResponse) {
  requestGet('/api/notify/v1/get_register_code', param, apiBaseURL, successResponse, errorResponse)
}










