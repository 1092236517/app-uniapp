import {get, post} from '../../common/utils/request.js'

const apis = {
	demandProcess(data, id) { //需求状态进度
		return get('/api/frontend/joint_purchase/super/joint_log/demandProcess/' + id, { data })
	},
	
	demandDetail(data, id) { //获取联采需求详情
		return get('/api/frontend/joint_purchase/super/group/demand/detail/' + id, { data })
	},
	
	demandProcessLog(data) { //操作日志
		return get('/api/frontend/joint_purchase/super/joint_log/lists', { data })
	},
	
	supplierList(data) { //供应商列表
		return get('/api/frontend/joint_purchase/super/group/demand/suppliers', { data })
	},
	
	paymentList(data) { //付款方式列表
		return get('/api/frontend/joint_purchase/super/group/pay_type/lists', { data })
	},
	
	push(data) { //推送供应商
		return post('/api/frontend/joint_purchase/super/group/demand/push', { data })
	},
	
    paymentTypeList(data) { //付款方式列表
    	return get('/api/frontend/joint_purchase/super/group/pay_type/lists', { data })
    },
    
	paymentTypeAdd(data) { //添加支付方式
		return post('/api/frontend/joint_purchase/super/group/pay_type/add', { data })
	},
	
    paymentTypeEdit(data, id) { //启用/禁用支付方式
    	return post('/api/frontend/joint_purchase/super/group/pay_type/edit/' + id, { data })
    },
    
    paymentTypeDelete(data) { //删除支付方式
    	return post('/api/frontend/joint_purchase/super/group/pay_type/delall', { data })
    },
    
	demandPurchaseDetail(data, id) { //获取联采需求单详情
		return get('/api/frontend/joint_purchase/super/group/demand/purchases/detail/' + id, { data })
	},
	
	demandList(data) { //需求列表
		return get('/api/mobile/joint_purchase/super/group/demand/mobilelists', { data })
	},
	
	demandCustomExamine(data, demandId, recordId) { //自定义审核
		return post('/api/frontend/joint_purchase/super/group/demand/custom_examine/' + demandId + '/' + recordId, { data })
	},
	
	selectSupplier(data, demandPurchaseId) { //选择供应商成交
		return post('/api/frontend/joint_purchase/super/group/demand/finish/' + demandPurchaseId, { data })
	}
}

export default apis