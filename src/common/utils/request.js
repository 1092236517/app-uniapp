const DEVELOPMENT_URL = 'https://devjjlcapi.zhuniu.com'
const PRODUCTION_URL = 'https://jjlcapi.zhuniu.com'
let baseURL = ''

if(process.env.NODE_ENV === 'development'){
    baseURL = DEVELOPMENT_URL;
}else{
    baseURL = PRODUCTION_URL;
}

export { baseURL }

/**
 * GET请求
 * @param  {String} url 请求url
 * @param  {Object} options.data 请求参数
 * @param  {Object} options.header 请求头部
 * @return {Object} Promise对象
 */
export const get = function(url, {data, header}={}) {
	return new Promise(function(resolve, reject) {
		const config = {
			method: 'GET'
		};
		config.url = baseURL + url;
		if(data){
			config.data = data;
		}
		if(header){
			config.header = header;
		}
		config.success = function(res) {
			resolve(res)
		};
		config.fail = function(err) {
			reject(err)
		}
		uni.request(config)
	})
}
/**
 * POST请求
 * @param  {String} url 请求url
 * @param  {Object} options.data 请求参数
 * @param  {Object} options.header 请求头部
 * @return {Object} Promise对象
 */
export const post = function(url, {data, header}={}) {
	return new Promise(function(resolve, reject) {
		const config = {
			method: 'POST'
		};
		config.url = baseURL + url;
		if(data){
			config.data = data;
		}
		if(header){
			config.header = header;
		}
		config.success = function(res) {
			resolve(res)
		};
		config.fail = function(err) {
			reject(err)
		}
		uni.request(config)
	})
}