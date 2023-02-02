import { get, del, post, put } from "../utils/request.js"

//获取首页数据
export function getHomeInfo(data){
	return post('/dataStatistics',data)
}

//获取健康码扫码记录
export function getSceneInfo(data){
	return post('/dataStatistics/sceneCode',data)
}

//获取核酸信息管理数据
export function getnucleicInfo(data){
	return post('/nucleicAcid/list',data)
}

//数据统计接口
// export function getnucleicInfo(data){
// 	return post('/dataStatistics',data)
// }