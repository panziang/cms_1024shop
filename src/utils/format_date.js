import dayjs from "dayjs";

//设置默认格式化形式
export function formatMonthDay (date, formatStr = "MM月DD日") {
  return dayjs(date).format(formatStr)
}

export function getCouponDate (time) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
export function getCouponCnDate (time) {
  return dayjs(time).format('YYYY-MM-DD')
}


export function getResTime (time) {
  return dayjs(time).format('YYYY年MM月DD日')
}