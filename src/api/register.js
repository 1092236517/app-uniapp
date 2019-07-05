import {get, post} from '../common/utils/request.js'

/**
 * 注册
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
const sendCodeUrl = '/api/frontend/zhuniusms';
const checkCodeUrl = '/api/frontend/zhuniusms/check';
const registerUrl = '/api/frontend/member/register';

const apis = {
	/**
	 * 发送验证码
	 * @author CodeAnti
	 * @email codeanti@zhuniu.com
	 */
	sendCode(mobile) {
		return get(sendCodeUrl, {
			data: {
				'mobile': mobile,
				'type': 'REGISTER'
			}
		})
	},
	/**
	 * check验证码
	 * @author CodeAnti
	 * @email codeanti@zhuniu.com
	 */
	checkCode(mobile, code) {
		return post(checkCodeUrl, {
			data: {
				'mobile': mobile,
				'code': code,
				'type': 'REGISTER'
			}
		})
	},
	/**
	 * register 注册
	 * @author CodeAnti
	 * @email codeanti@zhuniu.com
	 */
	register(mobile, username, password, repassword) {
		return post(registerUrl, {
			data: {
				'mobile': mobile,
				'user_name': username,
				'password': password,
				'repassword': repassword
			}
		})
	}
}

export default apis