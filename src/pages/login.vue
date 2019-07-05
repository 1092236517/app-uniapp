<template>
	<view class="login-wrapper">
		<image src="../static/images/login-bg.png" class="login-bg"></image>
		<view class="login-view">
			<view class="input-wrapper">
				<view class="prepend">
					<text class="iconfont">&#xe61d;</text>
				</view>
				<view class="input-view">
					<input
						class="zn-input"
						type="text"
						placeholder="请输入用户名/手机号"
						v-model="username"/>
				</view>
			</view>
			<view class="input-wrapper">
				<view class="prepend">
					<text class="iconfont">&#xe623;</text>
				</view>
				<view class="input-view">
					<input
						class="zn-input"
						type="text"
						placeholder="请输入登录密码"
						password
						v-model="password"/>
				</view>
			</view>
			<view class="register-forget">
				<text @click="toRegister">立即注册</text>
				<text @click="toForget">忘记密码?</text>
			</view>
			<button type="primary" class="login-btn" @click="login">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'login',
		onReady() {
			// 关闭启动页
			// #ifdef APP-PLUS  
			plus.navigator.closeSplashscreen();  
			// #endif
		},
		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			login() {
				let _this = this;
				let data = {
					'user_name': _this.username,
					'password': _this.password,
					'device': {"clientid": null}
				}
				
				// #ifdef APP-PLUS		
                // 推送的名称为 unipush
                uni.subscribePush({ 
                    provider: 'unipush',
                    success: function (res) {
                        data.device = res;
                        _this.$api.publicApi.userLogin(data).then(function(result) {
                            _this.loginLogic(result)
                        }).catch(function(e) {
                            _this.$func.showFailToast('登录失败');
                        });
                    },
                    fail: function (error) {
                        _this.$func.showFailToast('获取个推clientId错误');
                    }
                });			
				// #endif
				
				// #ifdef H5
				_this.$api.publicApi.userLogin(data).then(function(result) {
					_this.loginLogic(result)
				}).catch(function(e) {
					console.log(e)
					_this.$func.showFailToast('登录失败');
				});
				// #endif
			},
			// 登录跳转逻辑
			loginLogic(loginData) {
				let _this = this;
				switch (loginData.data.msg_code){
					// 登录成功
					case 100000:
						_this.loginSuccessLogic(loginData.data.response)
						break;
					default:
						_this.$func.showFailToast(loginData.data.message);
						break;
				}
			},
			loginSuccessLogic(response) {
				let memberInfo = response.memberInfo;
				let memberAuth = memberInfo.member_auth;
				let authStatus = memberInfo.auth_status;
				let accountType = this.getAccountType(response.user_role);
				// 普通模式，提示下载筑牛普通版联采APP
// 				if (memberAuth!=null && memberAuth.mode === 'NORMAL') {
// 					_this.$func.showFailToast('请下载筑牛普通版联采APP');
// 					return false;
// 				}
				
                //禁止供应商的登录
                if(accountType === 'SUPPLIER') {
                    uni.showToast({
                        title: '您登陆的账号为供应商，请下载筑牛供应商版',
                        icon: 'none',
                        mask: true,
                        duration: 3000
                    })
                    return
                }
                
				// 缓存用户相关信息
				uni.setStorageSync('user_info', memberInfo);
				uni.setStorageSync('user_token', response.token);
				uni.setStorageSync('user_powers', response.data);
				this.$store.commit('signIn', { currentUserRoles: response.roleIds, accountType, token: response.token, permissionData: response.data});
				
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
			},
			toRegister() {
				uni.navigateTo({
					url:'register/step1'
				})
			},
			toForget() {
				uni.navigateTo({
					url: './forget/step1'
				})
			},
			getAccountType(accountCode) { //获取账户类型
				let accountType;
				switch (accountCode) {
					case 1: //分公司
						accountType = 'BRANCH';
						break;
					case 2: //供应商
						accountType = 'SUPPLIER';
						break;
					case 3: //集团
						accountType = 'GROUP';
						break;
					default:
						accountType = '';
						break;
				}
				return accountType
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.input-placeholder {
		color: #D2D2D2;
	}
	.login-wrapper {
		.login-bg {
			width: 100%;
			height: 592upx;
		}
		.login-view {
			margin-top: 60upx;
			padding: 20upx 100upx;
			.input-wrapper {
				display: flex;
				flex-wrap: nowrap;
				justify-content: center;
				width: 100%;
				box-sizing: border-box;
				padding-bottom: 10upx;
				border-bottom: 1px solid #D5D5D5;
				&:first-child {
					margin-bottom: 60upx;
				}
				.input-view {
					margin-left: 20upx;
					flex-grow: 1;
					.zn-input {
						height: 40upx;
						width: 100%;
						line-height: 40upx;
						font-size: 26upx;
						color: #333;
						box-sizing: border-box;
						vertical-align: middle;		
					}
				}
			}
			.register-forget {
				display: flex;
				justify-content: space-between;
				margin-top: 20upx;
				font-size: 24upx;
				color: $uni-color-primary;
			}
			.login-btn {
				background-color: $uni-color-primary;
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				margin-top: 180upx;
				font-size: 32upx;
				box-shadow: 0 5px 5px #ccc;
			}
		}
	}
</style>
