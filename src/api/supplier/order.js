import {get, post} from '../../common/utils/request.js'

const apis = {
	orderProgress(data) { //供应商批次订单进度条和日志
		return get('/api/frontend/joint_purchase/super/supplier/process/lists', { data })
	},
	
	orderDetail(data, orderId) { //订单详情
		return get('/api/frontend/joint_purchase/super/supplier/order/detail/' + orderId, { data })
	},
	
	orderList(data) { //订单列表
		return get('/api/mobile/joint_purchase/super/supplier/order/mobilelists', { data })
	},
	
	slaveOrderDetail(data, slaveOrderId) { //批次订单详情
		return get('/api/mobile/joint_purchase/super/supplier/order/slaveorder/' + slaveOrderId, { data })
	},
	
	slaveOrderCheck(data, slaveOrderId) { //填写货量价
		return post('/api/frontend/joint_purchase/super/supplier/order/check_slave_order/' + slaveOrderId, { data })
	},
	
	confirmReceiveMoney(data, slaveOrderId) { //确认收款
		return post('/api/frontend/joint_purchase/super/supplier/order/confirm_received_money/' + slaveOrderId, { data })
	},
	
	sendGoods(data, slaveOrderId) { //确认发货
		return post('/api/frontend/joint_purchase/super/supplier/order/send_goods/' + slaveOrderId, { data })
	},
	
	webPriceCount(data){ //批次订单供应商写入网价显示总额
		return get('/api/frontend/joint_purchase/super/supplier/order/configure_actual_money', { data })
	},
    
    bankNameList(data){ //银行名称列表
    	return get('/api/frontend/joint_purchase/super/supplier/bank_account/bank_list', { data })
    }
}

export default apis