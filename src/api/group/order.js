import { get, post } from '../../common/utils/request.js'

const apis = {
	orderDetail(data, orderId) { //订单详情
		return get('/api/frontend/joint_purchase/super/group/order/detail/' + orderId, { data })
	},
	
	orderList(data) { //订单列表
		return get('/api/mobile/joint_purchase/super/group/order/mobilelists', { data })
	},
	
	slaveOrderProcess(data){ //批次订单状态进度
		return get('/api/frontend/joint_purchase/super/group/process/lists', { data })
	},
	
	slaveOrderLogList(data, slaveOrderNo){ //批次订单操作日志
		return get('/api/frontend/joint_purchase/super/group/process/logs/' + slaveOrderNo, { data })
	},
	
	slaveOrderDetail(data, slaveOrderId) { //批次订单详情
		return get('/api/mobile/joint_purchase/super/group/order/slaveorder/' + slaveOrderId, { data })
	},
	
	slaveOrderOfflinePay(data, slaveOrderId){ //集团支付批次订单
		return post('/api/frontend/joint_purchase/super/group/order/slave_order_pay/' + slaveOrderId, { data })
	},
	
	orderReportCount(data){//订单报表总价
		return get('/api/frontend/joint_purchase/super/group/slave/order/count',{ data })
	},
	
	orderClose(data, orderId) { //关闭订单
		return post('/api/frontend/joint_purchase/super/group/order/apply_close_order/' + orderId, { data })
	},
	
	orderCloseCheck(data, orderId) { //审核关闭申请
		return post('/api/frontend/joint_purchase/super/group/order/close_order_auth/' + orderId, { data })
	},
    
    webPriceCount(data){ //批次订单集团写入网价显示总额
    	return get('/api/frontend/joint_purchase/super/group/order/configure_actual_money', { data })
    },
    
    webPriceUpdate(data, slaveOrderId){ //批次订单财务部写入网价确定按钮
		return post('/api/frontend/joint_purchase/super/group/order/slave_order_price/' + slaveOrderId, { data })
	},
    
    bankNameList(data){ //银行名称列表
		return get('/api/frontend/joint_purchase/super/group/bank_account/bank_list', { data })
	}
}

export default apis