import {get, post} from '../common/utils/request.js'

/**
 * 注册
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
const sendCodeUrl = '/api/frontend/zhuniusms';
const checkCodeUrl = '/api/frontend/zhuniusms/check';
const resetPasswordUrl = '/api/mobile/member/reset/password';

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
				'type': 'RESET_PASSWORD'
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
				'type': 'RESET_PASSWORD'
			}
		})
	},
	/**
	 * reset password 重置密码
	 * @author CodeAnti
	 * @email codeanti@zhuniu.com
	 */
	resetPassword(mobile, password, repassword) {
		return post(resetPasswordUrl, {
			data: {
				'mobile': mobile,
				'password': password,
				'confirm_password': repassword
			}
		})
	}
}

export default apis