/**
 * 全局配置
 */
export const AppTool = {
  // 活动封面图
  default_cover: '//static.vhallyun.com/mp-prod/2e/ee/2eeea45977e8e825da2bbdd5a1d58326.jpg'
}
/**
 * 活动状态配置
 */
export const ActivityTool = {
  status: {
    PREPARE: 'PREPARE',
    LIVING: 'LIVING',
    FINISH: 'FINISH',
    PLAYBACK: 'PLAYBACK',
    THIRD: 'third'
  },
  playTypes: {
    PREPARE: 'pre',
    LIVING: 'live',
    FINISH: 'end',
    PLAYBACK: 'vod'
  },
  playStatuTypes: {
    PREPARE: '预告',
    LIVING: '直播中',
    FINISH: '结束',
    PLAYBACK: '回放'
  },
  pushType: {
    BROESER: 'BROESER', // 浏览器
    THIRD: 'THIRD' // 第三方推流
  }
}
/**
 * 营销工具
 */
export const SaleTool = {
  RECOMMEND_CARD_PUSH: 'RECOMMEND_CARD_PUSH', // 推送推荐卡片
  RECOMMEND_CARD_CREATE: 'RECOMMEND_CARD_CREATE', // 创建推荐卡片
  NAIRE: 'NAIRE', // 问卷
  NAIRE_CREATE: 'NAIRE_CREATE', // 添加问卷
  RED_PACKET_PUSH: 'RED_PACKET_PUSH', // 红包
  TOAST_NUM: 'TOAST_NUM', // 点赞
  WXLinkShow: 'wxLinkShow',
  DOC_DOWNLOAD_SWITCH: 'DOC_DOWNLOAD_SWITCH', // 资料下载开关
  ADD_ACTIVITY_DOC: 'ADD_ACTIVITY_DOC' // 文档添加
}
/**
 * 红包
 */
export const RedBagTool = {
  MARKET_TOOL: 'MARKET_TOOL', // 营销工具 消息 具体详细类型由里面的type区分
  createRedBag: 'RED_PACKET_PUSH' // 主持端创建红包完成
}
/**
 * 抽奖
 */
export const DrawTool = {
  createDraw: 'LOTTERY_PUSH', // 主持端创建c抽奖完成
  endLottery: 'LOTTERY_END', // 抽奖结束
  LOTTERY_CREATE: 'LOTTERY_CREATE' // 添加新奖品
}
/**
 * 聊天配置
 */
export const ChartTool = {
  ROLE_TYPE: {
    HOST: 'HOST',
    ASSISTANT: 'ASSISTANT',
    WATCH: 'WATCH'
  },
  CURRENT_ROLE: 'CURRENT_ROLE', // 当前角色
  JOIN: 'Join', // 用户上线
  LEAVE: 'Leave', // 用户下线
  CHAT: 'chat',
  ANNOUNCEMENT: 'ANNOUNCEMENT', // 公告
  KICK: 'KICK', // 踢出
  DISABLE_KICK: 'DISABLE_KICK',
  KICK_BATCH: 'KICK_BATCH', // 聊天审核，批量踢出
  GAG: 'GAG', // 禁言
  DISABLE_GAG: 'DISABLE_GAG',
  GAG_ALL: 'GAG_ALL', // 全体禁言
  DISABLE_GAG_ALL: 'DISABLE_GAG_ALL',
  DELETE_MESSAGE: 'DELETE_MESSAGE',
  CHAT_ADGED: 'CHAT_ADGED', // 聊天审核开关消息
  NEW_CHAT_AUTH: 'NEW_CHAT_AUTH', // 聊天审核新消息
  onLineNum: 'INCREMENT_ONLINE', // 虚拟人数通知
  announcement: 'ANNOUNCEMENT', // 公告
  beginLive: 'BEGIN_LIVE', // 开始直播
  endLive: 'FINISH_LIVE', // 结束直播
  DISABLE_LIVE: 'DISABLE_LIVE',
  MARKET_TOOL: 'MARKET_TOOL',
  ORDER_PAY: 'ORDER_PAY', // 商品购买
  DOC_TRANSFER_PROCESS: 'DOC_TRANSFER_PROCESS', // 文档转换进度
  QUESTION_PUSH: 'QUESTION_PUSH', // 问答-创建问题
  QUESTION_ANSWER: 'QUESTION_ANSWER', // 问答-问题回复
  QUESTION_DELETE: 'QUESTION_DELETE', // 问答-问题删除
  DELETE_ANSWER: 'DELETE_ANSWER', // 问答-问题回复
  QUESTION_DEAL: 'QUESTION_DEAL', // 问答-问题标记已处理
  QUESTION_IS_QUALITY: 'QUESTION_IS_QUALITY', // 问答-问题标记(取消)优质
  MENU_PUSH: 'MENU_PUSH', // 菜单开关推送
  GROUP: {
    GROUP_NEW: 'GROUP_NEW', // 群组被创建聊天
    PRIVATE_CHAT: 'PRIVATE_CHAT', // 群组聊天
    GROUP_DISSOLVE: 'GROUP_DISSOLVE' // 群组解散
  },
  GIFT_CHAT: 'GIFT_CHAT', // 礼物成功后的消息
  REWARD_CHAT: 'REWARD_CHAT' // 打赏成功后后的消息
}
/* 用户通知配置 */
export const UserTool = {
  ONLINE_USER_PASS: 'ONLINE_USER_PASS', // 并发套餐达到上线
  LIVE_FLOW_PASS: 'LIVE_FLOW_PASS', // 流量套餐用尽：
  KICK_ROLE: 'KICK_ROLE', // 主持人或者助理被踢出
  ROLE_RESET: 'ROLE_RESET' // 主持人或者助理控制台修改了口令
}
/* 全局Event BUS 配置 */
export const BusTool = {
  realOnlineNum: 'realOnlineNum', // 监听真实在线人数
  sendPassword: 'sendPassword', // 发送口令
  sendLotteryPassword: 'sendLotteryPassword', // 发送抽奖口令
  REAL_ONLINE_NUM: 'REAL_ONLINE_NUM', // 真实在线人数
  red_packet: 'red_packet',
  clickRedpack: 'clickRedpack', // 点击红包
  clickLottery: 'clickLottery', // 点击抽奖
  lottery_send: 'lottery_send', // 发送抽奖口令
  showQuestion: 'showQuestion', // 显示问卷
  GOODS_PUSH: 'GOODS_PUSH', // 商品
  RECOMMEND_CARD_PUSH: 'RECOMMEND_CARD_PUSH', // 卡片
  NAIRE: 'NAIRE', // 问卷
  RED_PACKET_PUSH: 'RED_PACKET_PUSH', // 红包
  LOTTERY_PUSH: 'LOTTERY_PUSH', // 抽奖
  LIVE_DELAY: 'LIVE_DELAY', // 直播延迟时间
  DO_LOGIN: 'DO_LOGIN', // 去登陆
  FOOTER_MENUS: 'FOOTER_MENUS' // 布局方式
}
export const LocalKey = {
  whitePhone: 'whitePhone',
  checked: 'CHECKED_DEVICE', // 是否设备检测
  CAMERA: 'SELECT_CAMERA',
  MIC: 'SELECT_MIC',
  VIDEO_SIZE: 'SELECT_VIDEO_SIZE',
  CAMERA_DEVICES: 'CAMERA_DEVICES', // 摄像头设备列表
  MIC_DEVICES: 'MIC_DEVICES', // 麦克风设备列表
  SPK: 'SPK',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  DESTORY: 'DESTORY',
  POSTER_CLICK: 'is_click_poster', // 是否点击海报
  WINNER_INFO: 'winnerInfo' // 领奖信息
}

export const VideoList = [
  { name: '超清', label: 'RTC_VIDEO_PROFILE_1080P_16x9_H' },
  { name: '高清', label: 'RTC_VIDEO_PROFILE_720P_16x9_H' },
  { name: '标清', label: 'RTC_VIDEO_PROFILE_480P_16x9_H' },
  { name: '流畅', label: 'RTC_VIDEO_PROFILE_360P_16x9_H' }
]

/* 视频清晰度和码率,参考wiki,与 VideoList 对应 */
/* http://wiki.vhallops.com/pages/viewpage.action?pageId=76218457 */
/* http://wiki.vhallops.com/pages/viewpage.action?pageId=174686533 */
export const ResolutionMap = {
  RTC_VIDEO_PROFILE_1080P_16x9_H: {
    resolution: '1920 x 1080',
    kbps: '2200'
  },
  RTC_VIDEO_PROFILE_720P_16x9_H: {
    resolution: '1280 x 720',
    kbps: '1500'
  },
  RTC_VIDEO_PROFILE_480P_16x9_H: {
    resolution: '848 x 480',
    kbps: '850'
  },
  RTC_VIDEO_PROFILE_360P_16x9_H: {
    resolution: '640 x 360',
    kbps: '400'
  }
}

/* 排行榜 */
export const RankListTool = {
  SHARE: 'share',
  // INVITE: 'invite',
  BUYER: 'buyer',
  WATCH: 'watch',
  REWARD: 'reward',
  GIFT: 'gift'
}
