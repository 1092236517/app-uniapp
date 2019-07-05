import {get, post} from '../../common/utils/request.js'

const apis = {
	demandDetail(data, id) { //获取联采需求详情
		return get('/api/mobile/joint_purchase/super/supplier/demand/detail/' + id, { data })
	},
	
	quotePrice(data, id) { //获取联采需求详情
		return post('/api/frontend/joint_purchase/super/supplier/demand_purchase_quoted_price/quota_price/' + id, { data })
	},
	
	demandList(data) { //联采需求列表
		return get('/api/mobile/joint_purchase/super/supplier/demand/mobilelists', { data })
	}
}

export default apis