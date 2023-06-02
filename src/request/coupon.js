/**
 * 优惠券请求api
 */
import { requestPost, requestGet } from './request'

// const apiBaseURL = import.meta.env.VITE_API_BASE_URL || null
// const apiBaseURL = 'http://localhost:9000/user-server/api'
const apiBaseURL = '/coupon-server'

/**
 * 查询xxxx数据
 * @param {*} param
 * @param {*} successResponse function(status, res, data)
 * @param {*} errorResponse function(status, error, msg)
 */
// export function getInfoList(param, successResponse, errorResponse) {
//   requestGet('/home/info_list/xxxxxx', param, apiBaseURL, successResponse, errorResponse)
// }

//获取优惠券列表
export function getCouponList (param, successResponse, errorResponse) {
  requestGet('/api/coupon/v1/page_coupon_list_admin', param, apiBaseURL, successResponse, errorResponse)
}

//删除优惠券
export function delCouponById (param, successResponse, errorResponse) {
  requestPost(`/api/coupon/v1/delete/${param.cid}`, param, apiBaseURL, successResponse, errorResponse)
}

//新增优惠券
export function addCoupon (param, successResponse, errorResponse) {
  requestPost('/api/coupon/v1/add_new_coupon', param, apiBaseURL, successResponse, errorResponse)
}














