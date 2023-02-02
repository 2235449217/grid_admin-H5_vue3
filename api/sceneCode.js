import { get, del, post, put } from "../utils/request.js"

//获取场所码管理列表
export function getPlaceList(data) {
	return post('/sceneCode/getSceneList', data)
}

//获取场所码管理场所类型
export function getPlaceType() {
	return post('/sceneCode/getCode')
}

