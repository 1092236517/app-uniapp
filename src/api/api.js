/**
 * Group Apis
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
import groupDemandApi from './group/demand.js'
import groupOrderApi from './group/order.js'
import groupMyApi from './group/my.js'
import groupHomeApi from './group/home.js'
import groupMessageApi from './group/message.js'
import groupAccountApi from './group/payment-account.js'
import groupPaymentInfoApi from './group/payment-info.js'

/**
 * Branch Apis
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
import branchDemandApi from './branch/demand.js'
import branchOrderApi from './branch/order.js'
import branchHomeApi from './branch/home.js'
import branchMessageApi from './branch/message.js'

/**
 * Suppier Apis
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
import supplierDemandApi from './supplier/demand.js'
import supplierOrderApi from './supplier/order.js'
import supplierHomeApi from './supplier/home.js'
import supplierMessageApi from './supplier/message.js'
import supplierReceiveApi from './supplier/receive-info.js'
/**
 * Register Apis
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
import registerApi from './register.js'

/**
 * Reset password Apis
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
import forgetPasswordApi from './forget.js'
import publicApi from './public.js'

export default {
	groupDemandApi,
	groupOrderApi,
	groupMyApi,
	groupHomeApi,
	groupMessageApi,
	groupAccountApi,
	groupPaymentInfoApi,
	branchDemandApi,
	branchOrderApi,
	branchHomeApi,
	branchMessageApi,
	supplierDemandApi,
	supplierOrderApi,
	supplierHomeApi,
	supplierMessageApi,
	supplierReceiveApi,
	registerApi,
	forgetPasswordApi,
	publicApi
}