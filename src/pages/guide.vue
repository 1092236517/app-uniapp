<template>
	<view class="guideView" :style="{height: guideViewHeight}">
		<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay">
			<swiper-item class="swiper-item">
				<image src="../static/images/guide/guide-1.png" mode="scaleToFill"></image>
			</swiper-item>
			<swiper-item class="swiper-item">
				<image src="../static/images/guide/guide-2.png" mode="scaleToFill"></image>
			</swiper-item>
			<swiper-item class="swiper-item">
				<image src="../static/images/guide/guide-3.jpg" mode="scaleToFill"></image>
				<view class="startBtn" @click="login"> 立即体验 </view>
			</swiper-item>
		</swiper>
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
	computed: {
		guideViewHeight() {
			return uni.getStorageSync('systemInfo').windowHeight + 'px'
		}
	},
	methods: {
		login() {
			uni.redirectTo({
				url: "login",
				success() {
					uni.setStorageSync('launchFlag', true);
				}
			})
		}
	},
    data() {
        return {
            indicatorDots: false, // 是否显示面板指示点
            autoplay: false,
        }
    }
}
</script>

<style>
	.swiper {
		height: 100%;
		width: 100%;
	}
	.swiper .swiper-item {
		height: 100%;
		width: 100%;
		position: relative;
	}
	.swiper .swiper-item image {
		height: 100%;
		width: 100%;
	}
	.swiper .swiper-item .startBtn {
		position: absolute;
		top: 84%;
		left: 30%;
		color: #0576DB;
		background-color: #D9EAFF;
		width: 40%;
		font-size: 34upx;
		text-align: center;
		border-radius: 40upx;
		height: 80upx;
		line-height: 80upx;
	}
	
	uni-button:after {
		border: 0upx;
	}
	
</style>
