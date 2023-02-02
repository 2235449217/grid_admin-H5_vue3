import { get, del, post, put } from "../utils/request.js"

//获取场所码管理列表
export function getRiskPerson(data) {
	return post('/riskPersonnel', data)
}