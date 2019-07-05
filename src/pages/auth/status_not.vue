<template>
	<view class="wrapper">
		<view class="main">
			<view class="content">
				<view class="image">
					<image style="width: 120px; height: 120px;" mode="aspectFit" src="../../static/images/auth/status_not.png"></image>
				</view>
				<view class="title">
					<text>尚未认证</text>
				</view>
				<view class="tips">
					<text>您暂无身份，请去认证您的身份</text>
				</view>
				<view class="buttons">
					<button size="mini" @tap="goOut">退出</button>
					<button size="mini" @tap="goAuth">去认证</button>
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
			
		},
		data() {
			return {
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
			goAuth() {
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
