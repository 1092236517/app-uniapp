import { get, post } from '../common/utils/request.js'

const apis = {
	userLaunchTime(data) { // 更新用户使用app时间
		return get('/api/mobile/member/lastlogintime', {data})
	},
	userLogin(data) { // 用户登陆
		return post('/api/mobile/member/login', {data});
	},
	
	userInfo(data) { //获取用户信息
		return get('/api/frontend/member/detail', {data})
	},
	
	userList(data) { // 用户列表
		return get('/api/frontend/member/memberlist', {data})
	},
	
	userAuth(data) { // 用户实名认证
		return post('/api/frontend/member/user/auth', {data});
	},

	accountList(data) { //获取子账号用户列表
		return get('/api/frontend/member/account/list', {data})
	},

	regionList(data) { //获取省市县列表
		return get('/api/frontend/region/list', {data})
	},
	
	productCategory(data) { //产品种类
		return get('/api/frontend/joint_purchase/super/category/lists', { data })
	}
}

export default apis