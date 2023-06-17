/**
 * 首页数据请求api
 */
import { requestPost, requestGet, requestUpload } from './request'

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
  requestGet(`/api/user/v1/user_delete/${param.user_id}`, param, apiBaseURL, successResponse, errorResponse)
}

//删除管理员
export function delAdminById (param, successResponse, errorResponse) {
  requestGet(`/api/user/v1/admin_delete/${param.user_id}`, param, apiBaseURL, successResponse, errorResponse)
}

//编辑管理员信息
export function editUserInfo (param, successResponse, errorResponse) {
  requestPost('/api/user/v1/admin_update_user', param, apiBaseURL, successResponse, errorResponse)
}

//管理员编辑管理员信息
export function editAdminInfo (param, successResponse, errorResponse) {
  requestPost('/api/user/v1/update_admin', param, apiBaseURL, successResponse, errorResponse)
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

//获取图形验证码
export function sendKaptcha (param, successResponse, errorResponse) {
  requestGet('/api/notify/v1/get_kaptcha', param, apiBaseURL, successResponse, errorResponse)
}

// 邮箱、手机号验证码发送  注册验证码
export function getSignCode (param, successResponse, errorResponse) {
  requestGet('/api/notify/v1/get_register_code', param, apiBaseURL, successResponse, errorResponse)
}

//登录验证码
export function getLoginCode (param, successResponse, errorResponse) {
  requestGet('/api/notify/v1/get_login_code', param, apiBaseURL, successResponse, errorResponse)
}

//注册管理员
export function signUpAdmin (param, successResponse, errorResponse) {
  requestPost('/api/user/v1/register_admin', param, apiBaseURL, successResponse, errorResponse)
}

//上传用户头像
export function getAvatar (param, successResponse, errorResponse) {
  requestUpload('/api/user/v1/upload_headImg', param, apiBaseURL, successResponse, errorResponse)
}

// 获取个人信息
export function getUserDetail (param, successResponse, errorResponse) {
  requestGet('/api/user/v1/detail', param, apiBaseURL, successResponse, errorResponse)
}



















