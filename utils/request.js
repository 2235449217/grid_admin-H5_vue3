import Axios from 'axios'
import baseUrl from './env.js';
import Config from '@/setting.js'
import settle from 'axios/lib/core/settle'
import buildURL from 'axios/lib/helpers/buildURL'
import buildFullPath from 'axios/lib/core/buildFullPath'
import {
	getToken,
	reSetToken,
	removeUserToken
} from '@/utils/auth.js'

//设置超时
Axios.defaults.timeout = Config.timeout;
//设置请求基地址
Axios.defaults.baseURL = baseUrl;

// 添加请求拦截器
Axios.interceptors.request.use((request) => {
	let token = getToken();
	request.headers['x-token'] = token;
	// request.headers['client'] = 'android';
	request.headers['Content-type'] = 'application/json';
	return request;
});

// 添加响应拦截器
Axios.interceptors.response.use(
	response => {
		const code = response.status || response.code;
		let token = response.header['New-Token']||response.header['new-token']
		if (token) {
			reSetToken(token);
		}
		if (code == undefined) {
			let error = {
				message: '网络异常',
				icon: 'none',
				duration: 1500
			};
			return Promise.reject(error);
		} else if (code < 200 || code > 300) {
			uni.showToast({
				title: response.message,
				icon: 'none',
				duration: 1500
			});
			return Promise.reject('error');
		} else {
			// cosonle.log('7,非法访问')
			// 如果为undefined 说明为下载接口，无code
			if (response.data.code === undefined) {
				return response.data;
			} else if (response.data.code == 7 && response.data.data.reload) {
				uni.showToast({
					title: response.data.msg,
					icon: 'none',
					duration: 1500
				});
				removeUserToken()
				uni.navigateTo({
					url: '/pages/login/login'
				})
			} else if (response.data.code !== 0) {
				uni.showToast({
					title: response.data.msg, //   根据后端返回数据，进行数据提示的调整  zkj
					icon: 'none',
					duration: 1500
				});
				return Promise.reject(response.data.msg);
			}
			return response.data;
		}
	},
	(error) => {
		let code = 0;
		try {
			code = error.response.status;
		} catch (e) {
			if (error.toString().indexOf('Error: timeout') !== -1) {
				uni.showToast({
					title: '网络请求超时',
					icon: 'none',
					duration: 1500
				});
				return Promise.reject(error);
			}
		}
		if (code) {
			if (code === 401) {
				try {
					uni.clearStorageSync();
				} catch (e) {
					uni.removeStorage({
						key: 'user',
						success: function(res) {}
					})
				}
			} else if (code === 403) {
				try {
					uni.clearStorageSync();
				} catch (e) {
					uni.removeStorage({
						key: 'user',
						success: function(res) {}
					})
				}
			} else if (code === 500) {
				uni.showToast({
					title: '服务器请求失败，请重试',
					icon: 'none',
					duration: 1500
				});
			} else {
				const errorMsg = error.response.message;
				if (errorMsg !== undefined) {
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 1500
					});
				}
			}
		} else {
			uni.showToast({
				title: '服务器请求失败，请重试',
				icon: 'none',
				duration: 1500
			});
		}
		return Promise.reject(error);
	}
);

//真机获取
Axios.defaults.adapter = function(config) {
	return new Promise((resolve, reject) => {
		let fullurl = buildFullPath(config.baseURL, config.url)
		uni.request({
			method: config.method.toUpperCase(),
			url: buildURL(fullurl, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};
				settle(resolve, reject, response);
			}
		})
	})
}

/**
 * get方法封装
 */
export function get(url, data) {
	return Axios.get(url, {
		params: data
	});
}

/**
 * delect方法封装
 */

export function del(url, data) {
	return Axios.delete(url, data);
}

/**
 * post方法封装
 */
export function post(url, data) {
	return Axios.post(url, data);
}

/**
 * put方法封装
 */
export function put(url, data) {
	return Axios.put(url, data);
}

export default Axios;
