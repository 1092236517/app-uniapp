const func = {
	/**
	 * 错误提示
	 * @param {String} message 错误信息
	 * @author CodeAnti
	 * @email codeanti@zhuniu.com
	 */
	showFailToast(message) {
		uni.showToast({
			icon: "none",
			title: message,
			duration:2000
		})
	},
	//"+、-"转换为"上浮、下浮"
	signToWords(value){
		let result = value.toString();
		let sign = result.charAt(0);
		if(sign == '+'){
			return '上浮 ' + result.slice(1)
		}else if(sign == '-'){
			return '下浮 ' + result.slice(1)
		}else{
			return '上浮 ' + result
		}
	},
	/**
	 * 异步弹窗
	 * @param  {String}  options.title  	  提示的内容
	 * @param  {String}  options.icon         图标，有效值 "success", "loading", "none"
	 * @param  {String}  options.image        自定义图标的本地路径
	 * @param  {Boolean} options.mask	      是否显示透明蒙层，防止触摸穿透
	 * @param  {Number}  options.duration     提示的延迟时间，单位毫秒
	 * @return {Object}  Promise对象
	 */
	asyncShowToast({title, icon, image, mask, duration}) {
		const config = {
			title,
			icon: 'none',
			duration: 2000,
            mask: true
		};
		if(icon) {
			config.icon = icon;
		}
		if(image) {
			config.image = image;
		}
		if(mask) {
			config.mask = mask;
		}
		if(duration) {
			config.duration = duration;
		}
		return new Promise((resolve, reject) => {
			uni.showToast(config);
			let timer = setTimeout(() => {
				clearTimeout(timer);
				timer = null;
				resolve();
			}, config.duration)
		})
	},
    /**
     * 更新页面及按钮权限
     * @param {Object} permissionObj 当前用户拥有的权限对象
     * @param {Object} authObj       当前页面的权限对象
     */
    getAuth(permissionObj, authObj) {
        if(!permissionObj) {
            console.error('请传入正确的用户权限对象');
            return false
        }
        const permissionList = permissionObj.transfers;
        Object.keys(authObj).forEach((key, authIndex) => {
            const chName = authObj[key]['chName'];
            permissionList.forEach((item, index) => {
                if(chName === item.power_transfer_name) {
                    authObj[key]['show'] = true;
                }
            })
        })
    }
}

export {func} 