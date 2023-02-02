// 可按需引入方法
import request, { get, post, put, del } from '../utils/request.js';

// description get方法
export function getEnterPersonList(params) {
	return post('backPersonnel/returnInfo', params);
}
