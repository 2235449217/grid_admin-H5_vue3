// 可按需引入方法
import request, { get, post, put, del } from '../utils/request.js';

// description get方法
export function getXX(params) {
	return get('url/url', params);
}

// description post方法
export function addXXX(data) {
	return post('url/url',data);
}

// description put方法
export function putFun(data) {
	return put('url/url', data);
}

// description delete方法
export function delSomething(data) {
	return del('url/url',data);
}

// description request自行配置请求方法等
export function example(data) {
    return request({
        url: 'url/url',
        method: 'put',
        data: data
    });
}
