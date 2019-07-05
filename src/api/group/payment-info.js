import {get, post} from '../../common/utils/request.js'

const apis = {
	infoList(data) { //支付信息列表
		return get('/api/frontend/joint_purchase/super/group/web_pay/lists', { data })
	},
	
	infoDetail(id,data) { //支付信息详情
		return get('/api/frontend/joint_purchase/super/group/web_pay/detail/'+id, { data })
	},
	
	infoToPay(data) { //去支付
		return post('/api/frontend/joint_purchase/super/group/web_pay/confirmpay', { data })
	},
	
}

export default apis