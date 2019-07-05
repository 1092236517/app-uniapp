<template>
	<view class="wrapper">
		<view class="main">
			<view class="content">
				<view class="image">
					<image style="width: 120px; height: 120px;" mode="aspectFit" src="../../static/images/auth/status_fail.png"></image>
				</view>
				<view class="title">
					<text>认证失败</text>
				</view>
				<view class="tips">
					<text>{{fail_reason}}</text>
				</view>
				<view class="buttons">
					<button size="mini" @tap="goOut">退出</button>
					<button size="mini" @tap="reAuth">重新认证</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onReady() {
			// 关闭启动页
			// #ifdef APP-PLUS  
			plus.navigator.closeSplashscreen();  
			// #endif
		},
		onLoad: function() {
			let userInfo = uni.getStorageSync('user_info');
			if (!userInfo) {
				this.$func.showFailToast('用户信息不存在');
			}
			let userAuth = userInfo.member_auth;
			if (userAuth === null) {
				this.$func.showFailToast('用户认证信息不存在');
			}
			this.fail_reason = userAuth.reject_reason;
		},
		data() {
			return {
				fail_reason: ''
			}
		},
		methods: {
			goOut(){
				uni.showModal({
					title: '提示',
					content: '是否确定退出？',
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '../login'
							});
							uni.clearStorageSync();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			reAuth() {
				uni.navigateTo({
					url: 'auth'
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
	
	.wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.content {
				height: 100%;
				padding: 30% 80upx 80upx;
				.image {
					text-align: center;
					margin-bottom: 20upx;
				}
				.title {
					width:100%;
					font-weight: bold;
					text-align: center;
					font-size: 44upx;
					margin-bottom: 20upx;
				}
				.tips {
					width:100%;
					text-align: center;
					font-size: 26upx;
					color: #EE1E1E;
					margin-bottom: 60upx;
				}
				.buttons {
					display: flex;
					flex-direction: row;
					font-size: 22upx;
					button {
						background-color: #FFFFFF;
						width: 40%;
						border-radius: 0;
						border: 2upx $uni-color-primary solid;
						color: $uni-color-primary;
						&::after {
							border: 0;
						}
					}
					:last-child{
						background-color: $uni-color-primary;
						width: 40%;
						border-radius: 0;
						border: 2upx $uni-color-primary solid;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>
