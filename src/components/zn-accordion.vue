<template>
	<view class="zn-accordion-wrapper">
		<view class="accordion-header" @click="toggleFold">
			<slot name="header">
				<view class="default-header">
					<text class="title">{{ title }}</text>
					<text class="iconfont icon" :class="{'icon-unfold': !isFold}">&#xe620;</text>
				</view>
			</slot>
		</view>
		<view class="accordion-content" :class="{'accordion-content-show': !isFold}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'zn-accordion',
		props: {
			title: {
				type: String
			},
			height: {
				type: Number,
				default: 200
			}
		},
		data() {
			return {
				isFold: true
			}
		},
		computed: {
			contentHeight() {
				return this.isFold ? '0px' : uni.upx2px(this.height) + 'px'
			}
		},
		methods: {
			toggleFold() {
				this.isFold = !this.isFold;
				this.$emit('foldChange', this.isFold);
			}
		}
	}
</script>

<style lang="scss">
	.zn-accordion-wrapper {
		width: 100%;
		.accordion-header {
			.default-header {
				display: flex;
				justify-content: space-between;
			}
			.icon {
				transition: all .3s ease;
			}
			.icon-unfold {
				transform: rotateZ(-90deg);
			}			
		}
		.accordion-content {
            display: none;
            &.accordion-content-show {
                display: block
            }
		}
	}
</style>
