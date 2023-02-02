import { get, post, put, del } from '../utils/request.js';
// 获取个人扫码信息列表
export function getNucleicAcid(data){
  return post('nucleicAcid/info',data)
};