import {get, post} from '../../common/utils/request.js'

const apis = {
	accountList(data) { //账户列表
		return get('/api/frontend/joint_purchase/super/group/bank_account/lists', { data })
	},
	
	accountDetail(id,data) { //账户详情
		return post('/api/frontend/joint_purchase/super/group/bank_account/detail/'+id, { data })
	},
	
	accountAdd(data) { //新增账户
		return post('/api/frontend/joint_purchase/super/group/bank_account/add', { data })
	},
	
	accountEdit(id,data) { //编辑账户
		return post('/api/frontend/joint_purchase/super/group/bank_account/edit/'+id, { data })
	},
	
	accountDelete(data) { //删除账户
		return post('/api/frontend/joint_purchase/super/group/bank_account/delete', { data })
	},
	
	bankList(data) { //银行列表
		return post('/api/frontend/joint_purchase/super/group/bank_account/bank_list', { data })
	},
	
	accountSet(data){
		return post('/api/frontend/joint_purchase/super/group/bank_account/set', { data })
	}
}

export default apis