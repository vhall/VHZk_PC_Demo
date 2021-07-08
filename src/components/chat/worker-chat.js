export default function WorkerChat () {
  this.chatData = []
  /* 格式化消息并放入消息列表 */
  this.formatChat = (params) => {
    let { msg, type, faceArr, chatFrequencyLevel, host, watch_type } = params
    try {
      let obj = {}
      if (msg.context && typeof msg.context === 'string') {
        msg.context = JSON.parse(msg.context)
      }
      if (typeof msg.data === 'string') {
        msg.data = JSON.parse(msg.data)
      }
      obj.txt = msg.data.text_content || ''
      obj.role = msg.context.role
      obj.name = msg.context.nick_name
      obj.msg_id = msg.msgId || msg.msg_id
      if (msg.data.zkType === 'MARKET_TOOL' || msg.send_id === 'MARKET_TOOL') { // 营销工具消息
        obj.msgType = 'marketTool'
        obj.detail = JSON.parse(msg.data.text_content)
        obj.eventType = obj.detail.type
        obj.name = obj.name || obj.detail.nick_name
      } else if (msg.data.zkType === 'GIFT_CHAT' || msg.data.zkType === 'REWARD_CHAT') { // 礼物/打赏
        obj.detail = JSON.parse(msg.data.text_content)
        obj.msgType = 'rewardTool'
        obj.eventType = 'chat'
      } else { // 普通聊天消息
        if (msg.data.zkType === 'imgChat') {
          obj.msgType = 'imgChat'
          obj.img_list = msg.data.img_list
        } else {
          obj.msgType = 'chat'
        }
        obj.eventType = 'chat'
        obj.id = msg.context.consumer_user_id
        obj.avatar = msg.context.avatar || msg.avatar
        if (obj.avatar && obj.avatar.indexOf('//') !== 0 && obj.avatar.indexOf('https') !== 0) {
          obj.avatar = obj.avatar ? `${host}/${obj.avatar}` : ''
        }
        obj.date_time = msg.time || msg.send_time
        obj.is_gag = msg.is_gag || 'N'
        obj.is_kick = msg.is_kick || 'N'
        if (obj.txt && obj.role !== 'watch') {
          obj.txt = obj.txt.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          /* 正则匹配校验url */
          /* eslint-disable */
          let reg =  /(https:\/\/|http:\/\/|\/\/|www\.)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
          obj.txt = obj.txt.replace(reg, (url) => {
            let href = url
            if (url.indexOf('www.') === 0) {
              href = `//${url}`
            }
            return `<a class='a_link' href="${href}" title="点击打开链接" target='_blank'>${url}</a>`
          })
          /* eslint-enable */
        }
        /* 替换表情图片 */
        for (let i = 0; i < faceArr.length; i++) {
          for (let key in faceArr[i]) {
            let test = key.replace(/\[/, '\\[').replace(/\]/, '\\]')
            let reg = new RegExp(test, 'g')
            obj.txt = obj.txt.replace(
              reg,
              "<img src='//cnstatic01.e.vhall.com/static/img/arclist/Expression_" +
              faceArr[i][key] +
              "@2x.png'>"
            )
          }
        }
        /* 组合atList到消息内  */
        if (msg.data.at_list && msg.data.at_list.length) {
          obj.at_list = msg.data.at_list
        }
      }
      if (watch_type === 'vod' || watch_type === 'end') {
        if (type === 'push') {
          this.chatData.push(obj)
        } else {
          this.chatData.unshift(obj)
        }
      } else {
        if (this.chatData.length >= 200) {
          let upsetLength = 0 // 用于减少splice操作造成的内存cpu飙升
          if (chatFrequencyLevel === 'maxHigh') {
            upsetLength = 40
          } else if (chatFrequencyLevel === 'high') {
            upsetLength = 20
          } else if (chatFrequencyLevel === 'mid') {
            upsetLength = 10
          }
          this.chatData.push(obj)
          this.chatData = this.chatData.splice(-200 + upsetLength)
        } else {
          this.chatData.push(obj)
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }
  onmessage = (message) => {
    /* onmessage接受主线程传递的参数 */
    const params = message.data.params
    /* eslint-disable */
    switch (message.data.type) {
      case 'chat':
        this.formatChat(params)
        /* postMessage把处理结果发送给主线程 */
        postMessage ({
          type: message.data.type,
          chatList: this.chatData
        })
        break
      case 'reset_chat_data':
        this.chatData = message.data.chatData
        break
    }
    /* eslint-enable */
  }
}
