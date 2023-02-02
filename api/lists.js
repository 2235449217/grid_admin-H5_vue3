// 可按需引入方法
import request, {
	get,
	post,
	put,
	del
} from '../utils/request.js';

// 部门接口
// description post方法
export function lists(data) {
	return post('department/lists', data);
}
