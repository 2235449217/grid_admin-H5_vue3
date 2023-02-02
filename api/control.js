import { get, del, post, put } from "../utils/request.js"

//获取管控方式列表
export function getControlList(data){
	return post('/healthCode/controlList',data)
}

//管控方式状态
export function getControlMode(data){
	return post('/healthCode/controlMode',data)
}

//场所码管理中启用停用接口
export function getUpdateSceneStatus(data){
	return post('/sceneCode/updateSceneStatus',data)
}