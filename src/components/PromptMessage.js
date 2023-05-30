import { ElMessage, ElMessageBox } from 'element-plus'
const PromptMessage = {
  /**
   * 消息提示框 (基础)
   * @param {*} typeT  success  warning info error
   * @param {*} messageT 提示消息正文内容 string/VNode
   * @param {*} durationT 显示时间，毫秒。设为0，则不会自动关闭
   * @returns
   */
  messageBase (typeT, messageT, durationT) {
    const options = {
      type: typeT,
      message: messageT,
      showClose: true,
      center: false,
      duration: durationT === undefined || durationT === null ? 5000 : durationT
    }
    ElMessage(options)
  },
  /**
   * 关闭消息提示框
   */
  messageCloseAll () {
    ElMessage.closeAll()
  },
  /**
   * 消息提示框 info
   * @param {*} messageT
   * @param {*} durationT
   * @returns
   */
  messageInfo (messageT, durationT) {
    return PromptMessage.messageBase('info', messageT, durationT)
  },
  /**
   * 消息提示框 success
   * @param {*} messageT
   * @param {*} durationT
   * @returns
   */
  messageSuccess (messageT, durationT) {
    return PromptMessage.messageBase('success', messageT, durationT)
  },
  /**
   * 消息提示框 warning
   * @param {*} messageT
   * @param {*} durationT
   * @returns
   */
  messageWarning (messageT, durationT) {
    return PromptMessage.messageBase('warning', messageT, durationT)
  },
  /**
   * 消息提示框 error
   * @param {*} messageT
   * @param {*} durationT
   * @returns
   */
  messageError (messageT, durationT) {
    return PromptMessage.messageBase('error', messageT, durationT)
  },
  /**
   * 消息提示弹框 (基础)
   * @param {*} typeT success info warning error
   * @param {*} titleT
   * @param {*} messageT 提示消息正文内容 string/VNode
   */
  messageBoxBase (typeT, titleT, messageT) {
    const options = {
      type: typeT,
      showCancelButton: false,
      confirmButtonText: '确认',
      closeOnClickModal: false
    }
    ElMessageBox.confirm(messageT, titleT || '提示消息', options)
  },
  /**
   * 消息提示弹框 info
   * @param {*} titleT
   * @param {*} messageT
   */
  messageBoxInfo (titleT, messageT) {
    PromptMessage.messageBoxBase('info', titleT, messageT)
  },
  /**
   * 消息提示弹框 success
   * @param {*} titleT
   * @param {*} messageT
   */
  messageBoxSuccess (titleT, messageT) {
    PromptMessage.messageBoxBase('success', titleT, messageT)
  },
  /**
   * 消息提示弹框 warning
   * @param {*} titleT
   * @param {*} messageT
   */
  messageBoxWarning (titleT, messageT) {
    PromptMessage.messageBoxBase('warning', titleT, messageT)
  },
  /**
   * 消息提示弹框 error
   * @param {*} titleT
   * @param {*} messageT
   */
  messageBoxError (titleT, messageT) {
    PromptMessage.messageBoxBase('error', titleT, messageT)
  }
}

export default PromptMessage
