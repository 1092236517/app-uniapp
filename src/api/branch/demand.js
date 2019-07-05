import {get, post} from '../../common/utils/request.js'

const apis = {
	demandAdd(data) { //新增联采需求
		return post('/api/mobile/joint_purchase/super/branch/demand/add', { data })
	},
	
	demandUpdate(data, demandId) { //编辑联采需求
		return post('/api/mobile/joint_purchase/super/branch/demand/update/' + demandId, { data })
	},
	
	demandDelete(data) { //删除未完成需求
		return post('/api/mobile/joint_purchase/super/branch/demand/delete', { data })
	},
	
	purchaseMaxCount(data) { //可采购最大数量
		return get('/api/frontend/joint_purchase/super/branch/demand/calculate_max_purchase_num', { data })
	},
	
	demandList(data) { //联采需求列表
		return get('/api/mobile/joint_purchase/super/branch/demand/mobilelists', { data })
	},
	
	demandProcess(data, id) { //需求状态进度
		return get('/api/frontend/joint_purchase/super/joint_log/demandProcess/' + id, { data })
	},
	
	demandDetail(data, id) { //联采需求详情
		return get('/api/frontend/joint_purchase/super/branch/demand/detail/' + id, { data })
	},
	
	demandProcessLog(data) { //操作日志
		return get('/api/frontend/joint_purchase/super/joint_log/lists', { data })
	},
	
	demandExamine(data, demandPurchaseId) { //审核需求单
		return post('/api/frontend/joint_purchase/super/branch/demand/examine/' + demandPurchaseId, { data })
	},
	
	demandEdit(data, demandId) { //编辑联采需求
		return post('/api/mobile/joint_purchase/super/branch/demand/edit/' + demandId, { data })
	},
	
	incompleteDemandList(data) { //不完整需求列表
		return get('/api/mobile/joint_purchase/super/branch/demand/lists', { data })
	},
	
	incompleteDemandDetail(data, incompleteDemandId) { //不完整需求详情
		return get('/api/mobile/joint_purchase/super/branch/demand/detail/' + incompleteDemandId, { data })
	}
}

export default apis