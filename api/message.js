import { get, post, put, del } from '../utils/request.js';
// 获取消息列表
export function getMessageList(data){
  return post('notice/isRead',data)
};
// 确定已读当用户点击的时候就调用，，
export function confirmMessage(data){
  return post('notice/readNotice',data)
};
// 整体有没有未读的消息，，，这个是只要你登录我就调用，然后根据状态来显示小红点
export function totalUnRead(){
  return post('notice/unRead')
}

export function getRiskNotice(data){
  return post('notice/riskAlertNotice',data)
}

