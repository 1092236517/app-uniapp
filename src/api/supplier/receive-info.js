import {get, post} from '../../common/utils/request.js'

const apis = {
	receiveAccountList(data){ //收款账户列表
		return get('/api/frontend/joint_purchase/super/supplier/web_pay/lists', { data })
	},
	
	receiveAccountDetail(id,data){ //收款账户详情
		return get('/api/frontend/joint_purchase/super/supplier/web_pay/detail/'+id, { data })
	},
}

export default apis