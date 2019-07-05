<template>
	<view class="no-more-wrapper">
		<view class="content">
			<view class="left-line"></view>
			<view class="desc">{{ desc }}</view>
			<view class="right-line"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'zn-no-more',
		props: {
			desc: {
				type: String,
				default: '没有更多了'
			}
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	@mixin line() {
		width: 160upx;
		height: 2upx;
		background: #999;
	}
	.no-more-wrapper {
		margin-top: 30upx;
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			color: #999;
			.left-line {
				@include line();
				margin-right: 20upx;
			}
			.right-line {
				@include line();
				margin-left: 20upx;
			}
		}
	}
</style>
