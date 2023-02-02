// 可按需引入方法
import request, {
	get,
	post,
	put,
	del
} from '../utils/request.js';

// 入豫人员管理接口
// description post方法
export function getVerification(data) {
	return post('verification/getVerification', data);
}

// 区域核查查看详情接口
// description post方法
export function getVerificationDetail(data) {
	return post('verification/getVerificationDetails', data);
}
