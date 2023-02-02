import { get, post, put, del } from '../utils/request.js';
// 获取某个场所代码的扫码人员列表
export function getScanCodeList(data){
  return post('sceneCode/getScanCodeList',data)
};
// 获取某个人的扫码人员列表
export function getMyselfRecord(data){
  return post('sceneCode/record',data)
};