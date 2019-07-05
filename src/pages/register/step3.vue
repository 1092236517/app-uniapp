<template>
	<view class="register-success-wrapper">
		<view class="main">
			<view class="content">
				<view class="success-icon">
					<text class="iconfont">&#xe615;</text>
				</view>
				<view class="title">
					<text>注册成功!</text>
				</view>
				<view class="tips">
					<text>您可以使用用户名({{user.user_name}})或手机号({{user.mobile}})作为登录名，进行账号登录。</text>
				</view>
				<view class="buttons">
					<button class="no-auth" size="mini" @tap="noAuth">暂不认证</button>
					<button class="go-auth" size="mini" @tap="goAuth">去认证</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function() {
			this.user = uni.getStorageSync('user');
			if(!this.user) {
				this.$func.showFailToast('用户获取失败');
			}
		},
		data() {
			return {
				user: '',
			}
		},
		methods: {
			noAuth() {
				// 清除缓存
				uni.removeStorageSync('user');
				// 跳转登录页
				uni.reLaunch({
					url: '../login'
				})
			},
			goAuth() {
				// 跳转
				uni.navigateTo({
					url: '../auth/auth?isregister=true'
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
	
	.register-success-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.content {
				height: 100%;
				padding: 150upx 80upx 80upx 80upx;
				.success-icon {
					text-align: center;
					margin-bottom: 20upx;
					.iconfont {
						font-family: iconfont;
						font-size: 132upx;
						vertical-align: middle;
						color: #44BF19;
					}
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
					color: #999999;
					margin-bottom: 100upx;
				}
				.buttons {
					display: flex;
					flex-direction: row;
					font-size: 22upx;
					button {
						background-color: #FFFFFF;
						border-radius: 0;
						width: 40%;
					}
					.no-auth {
						border: 2upx #999 solid;
						color: #999999;
					}
					.go-auth {
						border: 2upx $uni-color-primary solid;
						color: $uni-color-primary;
					}
				}
			}
		}
	}
</style>
