// 可按需引入方法
import request, { get, post, put, del } from '../utils/request.js';
// 获取列表接口函数
export function getKeyPerson(data){
  return post('keyPlacePerson',data)
};