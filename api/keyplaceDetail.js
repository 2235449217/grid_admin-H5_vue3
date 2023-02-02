// 可按需引入方法
import request, { get, post, put, del } from '../utils/request.js';
// 获取列表接口函数
export function getKeyPlaceList(data){
  return post('keyPlace',data)
};
// 通过id查询的列表
export function getIdList(id){
  return post('keyPlace/details')
};
// 重点场所派发
export function getDispatch(data){
  return post('keyPlace/dispatch',data)
};