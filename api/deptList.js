// 可按需引入方法
import request, {
	get,
	post,
	put,
	del
} from '../utils/request.js';

// 入豫人员管理接口
// description post方法
export function departMent(data) {
	return post('department/id', data);
}
