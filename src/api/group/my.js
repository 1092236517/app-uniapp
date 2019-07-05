import { get, post } from '../../common/utils/request.js'

const apis = {
	branchList(data) { //我的审核-分公司列表
		return get('/api/mobile/member/auth/list' , { data })
	},
	branchDetail(data,id) { //我的审核-分公司详情
		return get('/api/mobile/member/auth/detail/'+id , { data })
	},
	branchCheck(data,id) { //我的审核-分公司详情
		return get('/api/mobile/member/auth/check/'+id , { data })
	},
	accountList(data){//我的账户-账户列表
		return get('/api/frontend/member/quota/lists',{data})
	}
}

export default apis