<template>
	<view>
		<scroll-view class="zn-image-list-wrapper" scroll-x="true" @scroll="scroll">
			<view class="image-list">
				<view
					v-for="(image, index) in imageList"
					:key="index"
					class="image-view">
					<image :src="image.src" mode="aspectFill" @tap="previewImage(image)"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: 'zn-image-list-wrapper',
		props: {
			imageList: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			scroll() {
				this.$emit('image-scroll')
			},
			//预览图片
			previewImage(image) {
				uni.previewImage({
					current: image.src,
					urls: this.imageList.map(image => image.src)
				})
			},
		}
	}
</script>

<style lang="scss">
	.zn-image-list-wrapper {
		box-sizing: border-box;
		.image-list {
			display: flex;
			flex-wrap: nowrap;
			.image-view {
				margin: 10upx;
				image {
					width: 160upx;
					height: 160upx;
				}
			}
		}
	}
</style>
