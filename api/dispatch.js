import { get, del, post, put } from "../utils/request.js"

//获取健康码管理派发
export function getHealthDispatch(data){
	return post('/healthCode/dispatch',data)
}

//获取场所码派发信息
export function getPlaceDispatch(data) {
	return post('/sceneCode/dispatchSceneCode', data)
}

//获取重点场所派发信息
export function getKeyPlaceDispatch(data) {
	return post('/keyPlace/dispatch', data)
}

//获取风险人员派发信息
export function getRiskPersonnelDispatch(data) {
	return post('/riskPersonnel/dispatch', data)
}

//获取入豫人员派发信息
export function getEnterDispatch(data) {
	return post('/backPersonnel/backPersonnelDispatch', data)
}

//获取核查人员派发信息
export function getAreaCheckDispatch(data) {
	return post('/verification/verificationDispatch', data)
}

