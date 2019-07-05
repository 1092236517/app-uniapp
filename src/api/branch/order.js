import { get, post } from '../../common/utils/request.js'

const apis = {
	slaveOrderCreate(data) { //新建批次订单
		return post('/api/frontend/joint_purchase/super/branch/order/create_slave_order', { data })
	},
	
	slaveOrderEdit(data, editId) { //编辑批次订单
		return post('/api/frontend/joint_purchase/super/branch/order/update_slave_order/' + editId, { data })
	},
	
	orderDetail(data, orderId) { //订单详情
		return get('/api/frontend/joint_purchase/super/branch/order/detail/' + orderId, { data })
	},
	
	orderList(data) { //订单列表
		return get('/api/mobile/joint_purchase/super/branch/order/mobilelists', { data })
	},
	
	slaveOrderProcess(data){ //批次订单状态进度
		return get('/api/frontend/joint_purchase/super/branch/process/lists', { data })
	},
	
	slaveOrderLogList(data, slaveOrderNo){ //批次订单操作日志
		return get('/api/frontend/joint_purchase/super/branch/process/logs/' + slaveOrderNo, { data })
	},
	
	slaveOrderDetail(data, slaveOrderId) { //批次订单详情
		return get('/api/mobile/joint_purchase/super/branch/order/slaveorder/' + slaveOrderId, { data })
	},
	
	createSlaveOrder(data) { //创建批次订单
		return post('/api/frontend/joint_purchase/super/branch/order/create_slave_order', { data })
	},
	
	slaveOrderCheck(data, slaveOrderId) { //确认货量价
		return post('/api/frontend/joint_purchase/super/branch/order/confirm_slave_order/' + slaveOrderId, { data })
	},
	
	slaveOrderSign(data, slaveOrderId) { //确认收货
		return post('/api/frontend/joint_purchase/super/branch/order/sign_slave_order/' + slaveOrderId, { data })
	},
	
	orderClose(data, orderId) { //关闭订单
		return post('/api/frontend/joint_purchase/super/branch/order/apply_close_order/' + orderId, { data })
	}
}

export default apis