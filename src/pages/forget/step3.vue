<template>
	<view class="register-success-wrapper">
		<view class="main">
			<view class="content">
				<view class="success-icon">
					<text class="iconfont">&#xe615;</text>
				</view>
				<view class="title">
					<text>重置成功!</text>
				</view>
				<view class="tips">
					<text>{{times}}s后返回登录页或点击下方按钮返回</text>
				</view>
				<view class="buttons">
					<button class="go-login" size="mini" @tap="goLogin">去登录</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad: function() {
			
		},
		data() {
			return {
				times: 3,
				intervall:null
			}
		},
		onShow(){
			let that = this;
			clearInterval(that.intervall);
			that.intervall = null;
			that.intervall = setInterval(()=>{
				that.timeCount()
			},1000);
		},
		onUnload(){
			let that = this;
			clearInterval(that.intervall);
			that.intervall = null;
		},
		methods: {
			timeCount(){
				let that = this;
				if(parseInt(that.times)<=0){
					uni.redirectTo({
						url: '../login'
					})
				}else{
					that.times = parseInt(that.times) - 1;
				}
			},
			goLogin() {
				// 跳转
				uni.navigateTo({
					url: '../login'
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
					.go-login {
						border: 2upx $uni-color-primary solid;
						color: $uni-color-primary;
					}
				}
			}
		}
	}
</style>
