import {get, post} from '../../common/utils/request.js'

const apis = {
	messageList(data) { //消息列表
		return get('/api/frontend/joint_purchase/super/supplier/message/lists', { data })
	},
	
	messageDelete(data) { //删除消息
		return post('/api/frontend/joint_purchase/super/supplier/message/del', { data })
	},
	
	messageRead(data) { //标记已读
		return post('/api/frontend/joint_purchase/super/supplier/message/read', { data })
	}
}

export default apis