<template>
	<!-- 粘连布局 -->
	<view class="approve-wrapper">
		<view class="content-view">
			<view class="title-view">
				<text class="line"></text>
				<text class="title">联采规则<text class="tip">（非必填项）</text></text>
			</view>
			<view class="item-view">
				<text class="item-label">供应商报价截止日期</text>
				<view class="item-input">
					<zn-date-picker
						v-model="datePickerValue"
						@picker-confirm="handleDatePickerConfirm"></zn-date-picker>
				</view>
			</view>
			<view class="item-view">
				<text class="item-label item-textarea-label">联采说明</text>
				<view class="item-input">
					<textarea
						v-model="remark"
						placeholder="请填写联采说明"
						class="item-textarea"
						:maxlength="120"
						:auto-height="true"/>
				</view>
			</view>
			<view class="item-view-upload">
				<view class="label">上传附件</view>
				<zn-upload
					v-model="attachments"
					@upload-success="handleUploadSuccess"
					@delete-image="handleDeleteImage"></zn-upload>
				<view class="tip">
					您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="approve">同意</view>
		</view>
	</view>
</template>

<script>
	import znUpload from '../../../../components/zn-upload.vue'
	import znDatePicker from '../../../../components/zn-date-picker.vue'
	import dayjs from 'dayjs'
	
	export default {
		name: 'demand-approve',
		components: {
			znUpload,
			znDatePicker
		},
		data() {
			return {
				token: this.$store.state.token,
				demandId: '',
				recordId: '',
				datePickerValue: '',
				quoteDeadline: '',
				remark: '',
				attachments: []
			}
		},
		onLoad(option) {
			this.demandId = option.demandId;
			this.recordId = option.recordId;
            this.getDetail();
		},
		methods: {
			handleDatePickerConfirm(pickerObj) { //日期选择器确定
				const { date } = pickerObj;
				this.quoteDeadline = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
			},
			handleUploadSuccess(imageArr) { //图片上传成功
			
			},
			handleDeleteImage(imageArr) { //删除图片

			},
			approve() { //同意
				const params = {
					token: this.token,
					status: 'APPROVE',
					remark: this.remark,
					deadline: this.quoteDeadline
				};
				if(!this.quoteDeadline) {
					uni.showToast({
						title: '请选择报价截止时间',
						icon: 'none'
					})
					return false
				}
				if(this.attachments.length > 0) {
					params.attachments = this.attachments.map((item, index) => {
						return {
							original_name: item.originalFileName,
							path: item.newFileName
						}
					})
				}
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.groupDemandApi.demandCustomExamine(params, this.demandId, this.recordId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '操作成功',
                                icon: 'success',
                                duration: 3000
                            })
                            .then(val => {
                                uni.switchTab({
                                	url: '/pages/tabBar/joint-list/joint-list'
                                })
                            })
						}else {
							console.log(result);
							uni.showToast({
								title: result.message,
								icon: 'none'
							})
						}
					})
					.catch(err => {
                        uni.hideLoading();
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
            getDetail() { //获取联采需求详情
            	const params = {
            		token: this.token,
            		demand_id: this.demandId
            	}
            	this.$api.groupDemandApi.demandDetail(params, this.demandId)
            		.then(res => {
            			const result = res.data;
            			if(result.msg_code === 100000) {
            				const demandInfo = result.response;
            				this.datePickerValue = demandInfo.deadline;
                            this.quoteDeadline = dayjs(demandInfo.deadline);
            			}else {
            				console.log(result);
            				uni.showToast({
            					title: result.message,
            					icon: 'none'
            				})
            			}
            		})
            		.catch(err => {
            			console.log(err);
            			uni.showToast({
            				title: JSON.stringify(err),
            				icon: 'none'
            			})
            		})
            }
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.approve-wrapper {
		height: 100%;
		font-size: 28upx;
		.content-view {
			min-height: 100%;
			box-sizing: border-box;
			padding: 10upx 30upx;
			background: #fff;
			.title-view {
				font-size: 32upx;
				color: #333;
				font-weight: 700;
				padding-top: 30upx;
				padding-bottom: 30upx;
				border-bottom: 1px solid #eee;
				.tip {
					font-size: 32upx;
					font-weight: 400;
					color: #999;
				}
			}
			.line {
				display: inline-block;
				width: 6upx;
				height: 32upx;
				background: $uni-color-primary;
				margin-right: 20upx;
				border-radius: 3upx;
				vertical-align: middle;
			}
			.title{
				vertical-align: middle;
			}
			.item-view {
				display: flex;
				padding-top: 20upx;
				padding-bottom: 20upx;
				border-bottom: 1px solid #eee;
				.item-label {
					display: flex;
					align-items: center;
					font-size: 26upx;
					padding-right: 30upx;
					min-width: 130upx;
				}
				.item-input {
					flex-grow: 1;
					input {
						width: 100%;
					}
				}
				.item-textarea {
					width: 100%;
					height: 54upx;
					line-height: 54upx;
				}
				.item-textarea-label {
					align-self: flex-start;
				}
				.input-placeholder {
					color: $uni-text-color-placeholder;
				}
				.textarea-placeholder {
					font-size: 28upx;
					color: $uni-text-color-placeholder;
				}
				.accordion-content {
					padding: 20upx 0;
					color: #aaa;
				}
			}
			.item-view-upload {
				padding-top: 20upx;
				padding-bottom: 150upx;
			}
			.tip {
				font-size: 20upx;
				color: #999;
				line-height: 30upx;
			}
		}
		.button-wrapper {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			margin-top: -150upx;
			background: #eee;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;
				border-radius: 8upx;				
			}
		}
	}
</style>
