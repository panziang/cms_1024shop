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

//删除用户
export function delUserById (param, successResponse, errorResponse) {
  requestGet(`/api/user/v1/admin_delete/${param.user_id}`, param, apiBaseURL, successResponse, errorResponse)
}

//编辑用户信息
export function editUserInfo (param, successResponse, errorResponse) {
  requestPost('/api/user/v1/admin_update_user', param, apiBaseURL, successResponse, errorResponse)
}

//获取用户详情
export function getUserInfo (param, successResponse, errorResponse) {
  requestGet('/api/user/v1/detail', param, apiBaseURL, successResponse, errorResponse)
}

// 退出登录
export function getSignOut (param, successResponse, errorResponse) {
  requestGet('/api/user/v1/log_out', param, apiBaseURL, successResponse, errorResponse)
}

// 搜索用户
export function searchUser (param, successResponse, errorResponse) {
  requestGet('/api/user/v1/search', param, apiBaseURL, successResponse, errorResponse)
}

















