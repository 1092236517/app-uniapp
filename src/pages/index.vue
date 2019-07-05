<template>
	<div></div>
</template>

<script>
	export default {
		onLoad: function () {
			/**
			 * 获取本地存储launchFlag的值
			 * 若存在，说明不是首次启动，直接进入登录页
			 * 若不存在，说明是首次启动，进入引导页
			 * @author CodeAnti
			 * @email codeanti@zhuniu.com
			 */
			try {
				let _this = this;
				let launchFlag = uni.getStorageSync('launchFlag');
				let userToken = uni.getStorageSync('user_token');
				if (launchFlag) {
					if(userToken) {
						// 判断是否已长时间没有使用该App
						// 长时间没有登录则重新登录(15天)
						// 否则，刷新最近一次使用时间
						_this.$api.publicApi.userLaunchTime({"token": userToken}).then(function(result) {
							let data = result.data;
							if (data.msg_code === 100000) {
								let memberInfo = result.data.response.memberInfo;
								let memberAuth = memberInfo.member_auth;
								let authStatus = memberInfo.auth_status;
								
								// 重新缓存用户相关信息
								uni.setStorageSync('user_info', memberInfo);
								uni.setStorageSync('user_token', data.response.token);
								uni.setStorageSync('user_powers', data.response.data);
								
								// 审核通过
								if (authStatus === 'APPROVE') {	
									if (memberAuth.mode === 'SUPER') {
										// 超级联采
										uni.switchTab({
											url: 'tabBar/home/home'
										})
									} else {
										// 非超级及筑牛联采，补充信息, 升级为超级联采
										uni.redirectTo({
											url: 'auth/status_info_uncomplete'
										})
									}
								} else if (authStatus === 'NOT') {
									// 未提交认证
									uni.redirectTo({
										url: 'auth/status_not'
									})
								} else if (authStatus === 'VALID') {
									// 审核中
									uni.redirectTo({
										url: 'auth/status_wait'
									})
								} else if (authStatus === 'REJECT') {
									// 审核拒绝
									uni.redirectTo({
										url: 'auth/status_fail'
									})
								} else {
									this.$func.showFailToast('用户状态错误');
									return false;
								}
							} else {
								uni.redirectTo({
									url: 'login',
								})
							}
						});
					} else {
						// 未登录，跳转登录页
						uni.redirectTo({
							url: 'login',
						})
					}
				} else {
					uni.redirectTo({
						url: 'guide',
					})
				}
			} catch (e) {
				this.$func.showFailToast(e.message);
			}
		},
		onShow: function () {
			
		},
		onHide: function () {
			
		}
	}
</script>

<style>
</style>
