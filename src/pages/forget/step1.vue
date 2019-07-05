<template>
	<view class="register-wrapper">
		<view class="main">
			<view class="content">
				<!-- 标题 -->
				<view class="wrapper">
					<view class="title-wrapper"> 
						<view class="title">
							<text>第一步： 手机号码验证</text>
						</view>
					</view>
				</view>
				<!-- 手机号 -->
				<view class="wrapper">
					<view class="mobile-wrapper">
						<view class="mobile-input-wrapper">
							<view class="prepend">
								<text class="iconfont">&#xe62d;</text>
							</view>
							<view class="mobile-input-view">
								<input class="mobile-input" type="number" placeholder="请输入手机号" v-model="mobile" />
							</view>
							<view class="append" v-if="isShowClearMobileBtn" @tap="clearMobile">
								<text class="iconfont">&#xe603;</text>
							</view>
						</view>
						<view class="error-tip" v-if="isShowMobileErrorTip">
							<view class="prepend">
								<text class="iconfont">&#xe61b;</text>
							</view>
							<view class="error-view">
								<text class="error" v-text="mobileErrorTip"></text>
							</view>
						</view>
					</view>
				</view>
				<!-- 验证码 -->
				<view class="wrapper">
					<view class="code-wrapper">
						<view class="code-input-wrapper">
							<view class="prepend">
								<text class="iconfont">&#xe623;</text>
							</view>
							<view class="code-input-view">
								<input class="code-input" type="number" placeholder="请输入验证码" v-model="code"/>
							</view>
							<view class="code-tip" @tap="getCode">
								<text class="code-tip-text" v-text="codeTip"></text>
							</view>
						</view>
						<view class="error-tip" v-if="isShowCodeErrorTip">
							<view class="prepend">
								<text class="iconfont">&#xe61b;</text>
							</view>
							<view class="error-view">
								<text class="error" v-text="codeErrorTip"></text>
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
		data() {
			return {
				/* mobile */
				"mobile": "",
				"isShowClearMobileBtn": false,
				"isShowMobileErrorTip": false,
				"mobileErrorTip": "手机号码不符合规范",
				
				/* code */
				"code": "",
				"isShowCodeErrorTip": false,
				"isCanTapGetCodeBtn": true,
				"codeErrorTip": "验证码错误",
				"codeTip": "获取验证码",
				
				/* goNext */
				"isDisableGoNextBtn": false
			}
		},
		watch: {
			mobile: function(value) {
				let _this = this;
				if (value.length > 0) {
					_this.isShowClearMobileBtn = true;
					if (value.length >= 11) {
						validater.phoneNumber(value, (result, errorTip = '') => {
							if (!result) {
								_this.mobileErrorTip = errorTip;
								_this.isShowMobileErrorTip = true;
							} else {
								_this.mobileErrorTip = '';
								_this.isShowMobileErrorTip = false;
							}
						})
					}
				} else {
					_this.isShowClearMobileBtn = false;
					_this.isShowMobileErrorTip = false;
				}
			},
			code: function(value) {
				let _this = this;
				if (value.length >= 4) {
					validater.numberCode(value, 4, (result, errorTip = '') => {
						if (!result) {
							_this.codeErrorTip = errorTip;
							_this.isShowCodeErrorTip = true;
						} else {
							_this.codeErrorTip = '';
							_this.isShowCodeErrorTip = false;
						}
					})
				}
			}
		},
		methods: {
			clearMobile() {
				this.mobile = '';
			},
			/*获取验证码*/
			getCode() {
				let _this = this;
				// 倒计时中，不能获取code
				if (!_this.isCanTapGetCodeBtn) {
					return false;
				}
				validater.phoneNumber(_this.mobile, (result, errorTip = '') => {
					if (!result) {
						_this.mobileErrorTip = errorTip;
						_this.isShowMobileErrorTip = true;
					} else {
						_this.$api.forgetPasswordApi.sendCode(_this.mobile).then(function(result){
							if (result.data.msg_code == 100000) {
								_this.countDown();
							} else {
								_this.$func.showFailToast(result.data.message);
							}
						}).catch(function(e) {
							_this.$func.showFailToast("未知错误");
						});
					}
				})
			},
			goNext() {
				let _this = this;
				
				/*避免重复点击*/
				if (_this.isDisableGoNextBtn) {
					return false;
				}
				_this.isDisableGoNextBtn = true;
				
				/*验证手机号*/
				validater.phoneNumber(_this.mobile, (result, errorTip = '') => {
					if (!result) {
						_this.mobileErrorTip = errorTip;
						_this.isShowMobileErrorTip = true;
					}
				})
				
				/*验证code*/
				if (_this.code.length != 4) {
					_this.codeErrorTip = "验证码不符合规范";
					_this.isShowCodeErrorTip = true;
				}
				
				if (_this.isShowMobileErrorTip || _this.isShowCodeErrorTip) {
					_this.isDisableGoNextBtn = false;
					return false;
				}
				
				/* 记录手机号 */
				_this.$api.forgetPasswordApi.checkCode(_this.mobile, _this.code).then(function(result) {
					console.log(result);
					if (result.data.msg_code == 100000) {
						uni.navigateTo({
							url: 'step2?mobile=' + _this.mobile
						})
					} else {
						_this.isDisableGoNextBtn = false;
						_this.$func.showFailToast(result.data.message);
					}
				}).catch(function(e) {
					console.log(e);
					_this.isDisableGoNextBtn = false;
					_this.$func.showFailToast("未知错误");
				});
			},
			/* 倒计时 */
			countDown() {
				let _this= this;
				let codeCountDown = 60;
				_this.isCanTapGetCodeBtn = false;
				_this.codeTip = '已发送(' + codeCountDown + 's)';
				let timer = setInterval(function() {
					codeCountDown = codeCountDown - 1;
					if (codeCountDown <= 0) {
						_this.codeTip = '获取验证码';
						_this.isCanTapGetCodeBtn = true;
						clearInterval(timer);
						return false;
					}
					_this.codeTip = '已发送(' + codeCountDown + 's)';
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
	
	.register-wrapper {
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
					/*手机号*/
					.mobile-wrapper {
						height: 120upx;
						.mobile-input-wrapper {
							display: flex;
							flex-wrap: nowrap;
							box-sizing: border-box;
							border-bottom: 1px solid #D5D5D5;
							.mobile-input-view {
								margin-left: 20upx;
								flex-grow: 1;
								.mobile-input {
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
					
					/*验证码*/
					.code-wrapper {
						height: 120upx;
						.code-input-wrapper {
							display: flex;
							flex-wrap: nowrap;
							box-sizing: border-box;
							border-bottom: 1px solid #D5D5D5;
							.code-input-view {
								margin-left: 20upx;
								flex-grow: 1;
								.code-input {
									font-size: 26upx;
									color: #333;
									box-sizing: border-box;
									vertical-align: middle;		
								}
							}
							.code-tip {
								.code-tip-text {
									font-size: 26upx;
									color: $uni-color-primary;
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
