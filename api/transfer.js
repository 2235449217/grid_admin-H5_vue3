import { get, del, post, put } from "../utils/request.js"

//获取健康码管理转派状态
export function getHealthTransferStatus(data){
	return post('/healthCode/status',data)
}

//获取健康码管理转派
export function getHealthTransfer(data){
	return post('/healthCode/transfer',data)
}

//获取风险人员转派状态
export function getRiskTransferStatus(data){
	return post('/riskPersonnel/status',data)
}

//获取风险人员转派
export function getRiskTransfer(data){
	return post('/riskPersonnel/transfer',data)
}

//获取入豫人员转派状态
export function getBackTransferStatus(data){
	return post('/backPersonnel/status',data)
}

//获取入豫人员转派
export function getBackTransfer(data){
	return post('/backPersonnel/transfer',data)
}

//核查人员转派
export function getAreaTransfer(data){
	return post('/verification/innerCityTransfer',data)
}
