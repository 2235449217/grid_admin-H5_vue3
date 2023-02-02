import { get, post, put, del } from '../utils/request.js';

export function getCaptcha() {
	return post('base/captcha');
};
// 获取用户登录的接口
export function getLogin(data) {
  return post('base/login',data) 
};
// 获取用户信息的接口
export function getUserInfo(){
  return get('user/getUserInfo')
};
// 用户修改密码
export function changePassWord(data){
  return put('user/changePassword',data)
}