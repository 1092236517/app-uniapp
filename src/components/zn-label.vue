<template>
	<view class="label-wrapper">
		<view class="main" :style="{background: color}">{{ labelText }}</view>
		<view class="triangle-right" :style="{'border-left-color': color}"></view>
	</view>
</template>

<script>
	export default {
		name: 'zn-label',
		props: {
			labelText: {
				type: String
			},
			color: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss">
	.label-wrapper {
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		width: 160upx;
		font-size: 24upx;
		.main {
			width: 140upx;
			height: 42upx;
			line-height: 42upx;
			color: #fff;
			text-align: center;
			border-top-left-radius: 4upx;
			border-bottom-left-radius: 4upx;
		}
		.triangle-right {
			width: 0;
			height: 0;
			border-width: 21upx 0 21upx 10upx;
			border-style: solid;
			border-top-color: transparent;
			border-right-color: transparent;
			border-bottom-color: transparent;	
		}
		&:after {
			position: absolute;
			display: block;
			content: '';
			top: 14upx;
			right: 20upx;
			width: 14upx;
			height: 14upx;
			background: #fff;
			border-radius: 50%;
		}
	}
</style>
