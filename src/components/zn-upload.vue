<template>
	<view class="upload-wrapper">
		<block v-for="(image, index) in imageList" :key="index">
			<view class="upload-image-list">
				<view class="upload-image-view">
					<image mode="aspectFill" class="upload-image" :src="image.src" @tap="previewImage(image)"></image>
					<text class="iconfont delete" @tap="deleteImage(index)">&#xe6c9;</text>
				</view>
			</view>
		</block>
		<view
			v-if="isShowUploadBtn"
			class="upload-view"
			@tap="chooseImage"></view>
	</view>
</template>

<script>
    import { baseURL } from '../common/utils/request.js'
    
	/**
	 * 选择图片
	 * @param  {Number} options.count 选择图片的数量，默认为1
	 * @param  {Array}  options.sizeType original 原图，compressed 压缩图
	 * @param  {Array}  options.sourceType album 从相册选图，camera 使用相机
	 * @return {Object}  Promise对象
	 */
	const znChooseImage = function({count=1, sizeType, sourceType}={}) {
			return new Promise((resolve, reject) => {
				const config = {
					success(res) {
						resolve(res)
					},
					fail(err) {
						reject(err)
					}
				}
				if(count){
					config['count'] = count;
				}
				if(sizeType){
					config['sizeType'] = sizeType;
				}
				if(sourceType){
					config['sourceType'] = sourceType;
				}
				uni.chooseImage(config)
			})
	}
	/**
	 * 上传图片
	 * @param  {String}  url 上传服务器路径
	 * @param  {String}  options.filePath 要上传文件资源的路径
	 * @param  {String}  options.name 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容,默认值'file'
	 * @param  {Object}  options.header HTTP请求 Header, header 中不能设置 Referer
	 * @param  {Object}  iptions.formData HTTP 请求中其他额外的 form data，默认值{column:'joint_purchase',category:'publish_demand'}
	 * @return {Object}  Promise对象
	 */
	const znUploadFile = function(url, {filePath, name='file', header, formData={column:'joint_purchase',category:'publish_demand'}}={}){
		return new Promise((resolve, reject) => {
			const config = {
				url,
				name,
				filePath,
				formData,
				success(res) {
					resolve(res)
				},
				fail(err) {
					reject(err)
				}
			}
			uni.uploadFile(config);			
		})
	}
	export default {
		name: 'zn-upload',
		model: {
			prop: 'imageListInit',
			event: 'image-list-confirmed'
		},
		props: {
			limit: {
				type: Number,
				default: 6
			},
			imageListInit: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				imageList: []
			}
		},
		computed: {
			isShowUploadBtn() { //上传张数限制
				return this.imageList.length < this.limit
			}
		},
		watch: {
			imageListInit() {
				this.imageList = [...this.imageListInit];
			}
		},
		methods: {
			//选择图片
			chooseImage() {
				znChooseImage()
					.then(res => {
						const imagePathArr = res.tempFilePaths;
						uni.showLoading({
							title: '上传中...',
							mask: true
						})
						znUploadFile(baseURL + '/api/frontend/upload', {
							filePath: imagePathArr[0]
						})
						.then(res => {
							const {newFileName, originalFileName} = JSON.parse(res.data).response;
							const image = {
								src: imagePathArr[0],
								newFileName,
								originalFileName
							}
							this.imageList.push(image)
							this.$emit('image-list-confirmed', this.imageList)
							this.$emit('upload-success', this.imageList)
							uni.hideLoading()
							uni.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 1000
							})
						})
						.catch(err => {
							uni.hideLoading();
							uni.showToast({
								title: '上传失败，请检查网络',
								icon: 'none'
							})
							console.log(err)
						})
					})
					.catch(err => {
						console.log(err)
					})
			},
			//预览图片
			previewImage(image) {
				uni.previewImage({
					current: image.src,
					urls: this.imageList.map(image => image.src)
				})
			},
			//删除图片
			deleteImage(index) {
				const _this = this;
				uni.showModal({
					title: '提示',
					content: '确定删除该图片吗？',
					success(res) {
						if (res.confirm) {
							_this.imageList.splice(index, 1);
							_this.$emit('image-list-confirmed', _this.imageList);
							_this.$emit('delete-image', _this.imageList);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					fail(err) {
						console.log('删除失败', err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@mixin upload-line($width, $height) {
		position: absolute;
		top: 50%;
		left: 50%;
		content: '';
		display: block;
		background: #DCDCDC;
		width: $width;
		height: $height;
		transform: translate(-50%, -50%)		
	}
	.upload-wrapper {
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 0;
		.upload-image-list {
			.upload-image-view {
				position: relative;
				width: 160upx;
				height: 160upx;
				margin: 6upx;
				.upload-image {
					width: 100%;
					height: 100%;
				}
			}
			.delete {
				display: inline-block;
				position: absolute;
				top: 12upx;
				left: 12upx;
				width: 40upx;
				height: 40upx;
				line-height: 40upx;
				font-size: 40upx;
				text-align: center;
				background: rgba(0, 0, 0, .5);
				color: #fff;
				border-radius: 50%;
			}
		}
		.upload-view {
			position: relative;
			width: 160upx;
			height: 160upx;
			margin: 6upx;
			border: 1px dashed #DCDCDC;
			&:before {
				@include upload-line(2upx, 70upx)
			}
			&:after {
				@include upload-line(70upx, 2upx)
			}
		}
	}
</style>
