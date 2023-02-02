//在请求删除接口时，要特别注意，与传参时不同，需要传一个{data:params}
import { get, del, post, put } from "../utils/request.js"

//入豫人员删除
export function getBackDel(data){
	return del('/backPersonnel/deleteBackPersonnel',data)
}

//健康码管理删除
export function getHealthDel(data){
	return del('/healthCode/del',data)
}

//风险人员管理删除
export function getriskDel(data){
	return del('/riskPersonnel/del',data)
}