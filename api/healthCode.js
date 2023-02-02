import { get, del, post, put } from "../utils/request.js"

//获取健康码管理列表
export function getHealthList(data){
	return post('/healthCode',data)
}

