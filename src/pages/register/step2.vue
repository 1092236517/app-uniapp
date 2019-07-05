<template>
	<view class="username-password-wrapper">
		<view class="main">
			<view class="content">
				<!-- 标题 -->
				<view class="wrapper">
					<view class="title-wrapper">
						<view class="title">
							<text>第二步： 设置用户名和密码</text>
						</view>
					</view>
				</view>
				<!-- 用户名 -->
				<view class="wrapper">
					<view class="username-wrapper">
						<view class="username-input-wrapper">
							<view class="prepend">
								<text class="iconfont">&#xe61d;</text>
							</view>
							<view class="username-input-view">
								<input class="username-input" type="text" placeholder="请输入用户名" v-model="username" />
							</view>
							<view class="append" v-if="isShowClearUsernameBtn" @tap="clearUsername">
								<text class="iconfont">&#xe603;</text>
							</view>
						</view>
						<view class="error-tip" v-if="isShowUsernameErrorTip">
							<view class="prepend">
								<text class="iconfont">&#xe61b;</text>
							</view>
							<view class="error-view">
								<text class="error" v-text="usernameErrorTip"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 密码 -->
				<view class="wrapper">
					<view class="password-wrapper">
						<view class="password-input-wrapper">
							<view class="prepend">
								<text class="iconfont">&#xe614;</text>
							</view>
							<view class="password-input-view">
								<input class="password-input" type="password" placeholder="请输入6-16位数字和字母结合" v-model="password" />
							</view>
							<view class="append" v-if="isShowClearPasswordBtn" @tap="clearPassword">
								<text class="iconfont">&#xe603;</text>
							</view>
						</view>
						<view class="error-tip" v-if="isShowPasswordErrorTip">
							<view class="prepend">
								<text class="iconfont">&#xe61b;</text>
							</view>
							<view class="error-view">
								<text class="error" v-text="passwordErrorTip"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 重复密码 -->
				<view class="wrapper">
					<view class="repassword-wrapper">
						<view class="repassword-input-wrapper">
							<view class="prepend">
								<text class="iconfont">&#xe614;</text>
							</view>
							<view class="repassword-input-view">
								<input class="repassword-input" type="password" placeholder="请输入6-16位数字和字母结合" v-model="repassword" />
							</view>
							<view class="append" v-if="isShowClearRepasswordBtn" @tap="clearRepassword">
								<text class="iconfont">&#xe603;</text>
							</view>
						</view>
						<view class="error-tip" v-if="isShowRepasswordErrorTip">
							<view class="prepend">
								<text class="iconfont">&#xe61b;</text>
							</view>
							<view class="error-view">
								<text class="error" v-text="repasswordErrorTip"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="button" @tap="goNext">下一步</view>
		</view>
	</view>
</template>

<script>
	import {validater} from '../../common/utils/validater.js'
	
	export default {
		onLoad: function(option) {
			if (!option.mobile) {
				this.$func.showFailToast("未知错误");
			}
			this.mobile = option.mobile;
		},
		data() {
			return {
				/* 手机号 */
				mobile: '',
				
				/*用户名*/
				username: '',
				isShowClearUsernameBtn: false,
				isShowUsernameErrorTip: false,
				usernameErrorTip: "用户名不符合规则",
				
				/* 密码 */
				password: '',
				isShowClearPasswordBtn: false,
				isShowPasswordErrorTip: false,
				passwordErrorTip: "密码不符合规则",
				
				/* 重复密码 */
				repassword: '',
				isShowClearRepasswordBtn: false,
				isShowRepasswordErrorTip: false,
				repasswordErrorTip: "密码不符合规则",
				
				/* goNext */
				"isDisableGoNextBtn": false
			}
		},
		watch: {
			username: function(value) {
				let _this = this;
				if (value.length > 0) {
					_this.isShowClearUsernameBtn = true;
					/* TODO 用户名规则验证  */
					_this.isShowUsernameErrorTip = false;
					_this.usernameErrorTip = '';
				} else {
					_this.isShowClearUsernameBtn = false;
				}
			},
			password: function(value) {
				let _this = this;
				if (value.length > 0) {
					_this.isShowClearPasswordBtn = true;
					/* 密码规则验证  */
					validater.password(_this.password, (result, errorTip = '') => {
						if (!result) {
							_this.isShowPasswordErrorTip = true;
							_this.passwordErrorTip = errorTip;
							return false;
						} else {
							_this.isShowPasswordErrorTip = false;
							_this.passwordErrorTip = '';
						}
						
						if (_this.password.length > 16) {
							_this.isShowPasswordErrorTip = true;
							_this.passwordErrorTip = '请输入6-16位数字和字母结合';
							return false;
						}
					});
				} else {
					_this.isShowClearPasswordBtn = false;
					_this.isShowPasswordErrorTip = false;
					
				}
			},
			repassword: function(value) {
				let _this = this;
				if (value.length > 0) {
					_this.isShowClearRepasswordBtn = true;
					/* 密码规则验证  */
					validater.password(_this.repassword, (result, errorTip = '') => {
						if (!result) {
							_this.isShowRepasswordErrorTip = true;
							_this.repasswordErrorTip = errorTip;
							return false;
						} else {
							_this.isShowRepasswordErrorTip = false;
							_this.repasswordErrorTip = '';
						}
						
						if (_this.repassword.length > 16) {
							_this.isShowRepasswordErrorTip = true;
							_this.repasswordErrorTip = '请输入6-16位数字和字母结合';
							return false;
						}
					});
				} else {
					_this.isShowClearRepasswordBtn = false;
					_this.isShowRepasswordErrorTip = false;
					_this.repasswordErrorTip = '';
				}
			}
		},
		methods: {
			goNext() {
				let _this = this;
				
				/* 避免重复点击 */
				if (_this.isDisableGoNextBtn) {
					return false;
				}
				
				/* 校验 */
				if (!_this.username) {
					_this.isShowUsernameErrorTip = true;
					_this.usernameErrorTip = '请填写用户名';
				}
				
				if (!_this.password) {
					_this.isShowPasswordErrorTip = true;
					_this.passwordErrorTip = '请填写密码';
				}
				
				if (!_this.repassword) {
					_this.isShowRepasswordErrorTip = true;
					_this.repasswordErrorTip = '请填写密码';
				}
				
				if (_this.password != _this.repassword) {
					_this.isShowRepasswordErrorTip = true;
					_this.repasswordErrorTip = '2次输入密码不一样';
					return false;
				}
				
				if (_this.isShowUsernameErrorTip || _this.isShowPasswordErrorTip || _this.isShowRepasswordErrorTip) {
					return false;
				}
				
				_this.isDisableGoNextBtn = true;
				
				/* 注册 */
				_this.$api.registerApi.register(_this.mobile, _this.username, _this.password, _this.repassword).then(function(result) {
					if (result.data.msg_code == 100000) {
						// 存储用户对象
						uni.setStorageSync("user",result.data.response);
						
						uni.navigateTo({
							url: 'step3',
							complete: function(){
								_this.isDisableGoNextBtn = false;
							}
						})
					} else {
						_this.$func.showFailToast(result.data.message);
					}
					_this.isDisableGoNextBtn = false;
				}).catch(function(e) {
					console.log(e);
					_this.$func.showFailToast('未知错误')
				});
			},
			clearUsername() {
				this.username = '';
				this.isShowClearUsernameBtn = false;
			},
			clearPassword() {
				this.password = '';
				this.isShowClearPasswordBtn = false;
			},
			clearRepassword() {
				this.repassword = '';
				this.isShowClearRepasswordBtn = false;
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
	
	.username-password-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.content {
				height: 100%;
				padding: 120upx 80upx 150upx 80upx;
				.wrapper {
					/* 标题 */
					.title-wrapper {
						padding-bottom: 80upx;
						.title {
							font-weight: bold;
							font-size: 36upx;
							color: #333;
						}
					}
					/*用户名*/
					.username-wrapper {
						height: 120upx;
						.username-input-wrapper {
							display: flex;
							flex-wrap: nowrap;
							box-sizing: border-box;
							border-bottom: 1px solid #D5D5D5;
							.username-input-view {
								margin-left: 20upx;
								flex-grow: 1;
								.username-input {
									font-size: 26upx;
									color: #333;
									box-sizing: border-box;
									vertical-align: middle;		
								}
							}
						}
						.error-tip {
							display: flex;
							flex-wrap: nowrap;
							color: #EE1E1E;
							.iconfont {
								color: #EE1E1E;
							}
							.error {
								margin-left: 20upx;
								font-size: 26upx;
							}
						}
					}
					/* 密码 */
					.password-wrapper {
						height: 120upx;
						.password-input-wrapper {
							display: flex;
							flex-wrap: nowrap;
							box-sizing: border-box;
							border-bottom: 1px solid #D5D5D5;
							.password-input-view {
								margin-left: 20upx;
								flex-grow: 1;
								.password-input {
									font-size: 26upx;
									color: #333;
									box-sizing: border-box;
									vertical-align: middle;		
								}
							}
						}
						.error-tip {
							display: flex;
							flex-wrap: nowrap;
							color: #EE1E1E;
							.iconfont {
								color: #EE1E1E;
							}
							.error {
								margin-left: 20upx;
								font-size: 26upx;
							}
						}
					}
					
					/* 重复密码 */
					.repassword-wrapper {
						height: 120upx;
						.repassword-input-wrapper {
							display: flex;
							flex-wrap: nowrap;
							box-sizing: border-box;
							border-bottom: 1px solid #D5D5D5;
							.repassword-input-view {
								margin-left: 20upx;
								flex-grow: 1;
								.repassword-input {
									font-size: 26upx;
									color: #333;
									box-sizing: border-box;
									vertical-align: middle;		
								}
							}
						}
						.error-tip {
							display: flex;
							flex-wrap: nowrap;
							color: #EE1E1E;
							.iconfont {
								color: #EE1E1E;
							}
							.error {
								margin-left: 20upx;
								font-size: 26upx;
							}
						}
					}
				}
			}
		}
		.button-wrapper {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			margin-top: -150upx;
			background: #fff;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;
				border-radius: 8upx;				
			}
		}
	}
</style>
