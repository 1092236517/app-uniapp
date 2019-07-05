import {get, post} from '../../common/utils/request.js'

const apis = {
	operateCount(data) { //需要操作的数量
		return get('/api/mobile/joint_purchase/super/supplier/count/operate', { data })
	}
}

export default apis