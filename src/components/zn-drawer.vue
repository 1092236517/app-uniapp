<template>
	<view
		class="zn-drawer-wrapper"
		:class="{'zn-drawer-visible': visible}">
		<view
			class="zn-drawer-mask"
			@touchmove.stop.prevent="moveHandle"
			@tap="close"></view>
		<view
			class="zn-drawer-content"
			:style="{background: backgroundColor}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'zn-drawer',
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			backgroundColor: {
				type: String,
				default: '#fff'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			moveHandle() { //阻止滚动穿透
				return
			},
			close() { //关闭
				this.$emit('update:visible', false);
				this.$emit('close', false);
			}
		}
	}
</script>

<style lang="scss">
	.zn-drawer-wrapper {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
		visibility: hidden;
		z-index: 998;
		height:100%;
		.zn-drawer-mask {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.4);
		}
		.zn-drawer-content {
			display: block;
			position: absolute;
			top: 0;
			right: 0;
			height: 100%;
			transition: all 0.3s ease-out;
			transform: translateX(100%);
		}
		&.zn-drawer-visible {
			visibility: visible;
			.zn-drawer-content {
				transform: translateX(0);
			}
		}
	}
</style>
