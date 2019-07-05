<template>
	<view class="select-payment-wrapper">
        <view class="content">
        	<view class="swiper-wrapper">
        		<view class="swiper-item-wrapper">
        			<view class="content-view">
        				<view class="title-view">
        					<view>
        						<text class="line"></text>
        						<text class="title">支付信息</text>
        					</view>
        				</view>
        				<view class="item-view">
        					<text class="item-label">支付金额</text>
        					<view class="item-input">
        						<input
        							type="digit"
        							placeholder="请填写支付金额"
        							v-model.trim="offline.groupPayAmount"/>
        					</view>
        				</view>
        				<view class="item-view">
        					<text class="item-label">确认金额</text>
        					<view class="item-input">
        						<input
        							type="digit"
        							placeholder="请填写确认金额"
        							v-model.trim="offline.groupPayAmountConfirmed"/>
        					</view>
        				</view>
        				<view class="item-view">
        					<text class="item-label item-textarea-label">备注信息</text>
        					<view class="item-input">
        						<textarea
        							v-model="offline.remark"
        							placeholder="请填写备注(选填)"
        							class="item-textarea"
        							:maxlength="120"
        							:auto-height="true"/>
        					</view>
        				</view>
        				<view class="item-view-upload">
        					<view class="label">上传附件（选填）</view>
        					<zn-upload
        						v-model="offline.imageList"
        						@upload-success="handleUploadSuccess"
        						@delete-image="handleDeleteImage"></zn-upload>
        					<view class="tip">
        						您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
        					</view>
        				</view>
        			</view>
        			<view class="button-wrapper">
        				<view class="button" @click="offlineSubmit">确认支付</view>
        			</view>
        		</view>
        	</view>
        </view>
		<!-- <view class="content">
			<view class="nav-bar-view">
				<view class="nav-bar">
					<view
						v-for="(item, index) in navList"
						:key="index"
						:class="{active: index === swiperIndex}"
						@click="handleNavClick(index)">
						{{ item.label }}
					</view>
				</view>
				<view class="line" :style="{left: marginLeft}"></view>
			</view>
			<view class="swiper-wrapper">
				<swiper
					:current="swiperIndex"
					@change="swiperChange"
					@animationfinish="handleSwiperAnimationFinish">
					<swiper-item>
						<scroll-view class="swiper-item-wrapper" scroll-y>
							<view class="content-view">
								<view class="title-view">
									<view>
										<text class="line"></text>
										<text class="title">付款方信息</text>
									</view>
									<text class="add-btn">+ 添加付款账号</text>
								</view>
								<view class="item-view">
									<text class="item-label">账号名称</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写付款账号名称"/>
									</view>
									<view class="iconfont add-icon">
										&#xe61d;
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">付款账号</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写付款账号"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">银行名称</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写银行名称"/>
									</view>
								</view>
							</view>
							<view class="content-view">
								<view class="title-view">
									<view>
										<text class="line"></text>
										<text class="title">收款方信息</text>
									</view>
									<text class="add-btn">+ 添加收款账号</text>
								</view>
								<view class="item-view">
									<text class="item-label">账号名称</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写付款账号名称"/>
									</view>
									<view class="iconfont add-icon">
										&#xe61d;
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">收款账号</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写付款账号"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">银行名称</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写银行名称"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">城市名称</text>
									<view class="item-input">
										<zn-address-picker
											v-model="addressPickerValue"
											@picker-item-change="handleAddressPickerChange"
											@picker-confirm="handleAddressPickerConfirm"></zn-address-picker>
									</view>
								</view>
							</view>
							<view class="content-view">
								<view class="title-view">
									<view>
										<text class="line"></text>
										<text class="title">支付信息</text>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">加急程度</text>
									<view class="item-input">
										<zn-picker
											v-model="pickerValue"
											:pickerValueMulArray="pickerData"
											placeholder="请填写加急程度"
											@picker-item-change="handlePickerChange"></zn-picker>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">业务类型</text>
									<view class="item-input">
										<zn-picker
											v-model="pickerValue"
											:pickerValueMulArray="pickerData"
											placeholder="请选择业务类型"
											@picker-item-change="handlePickerChange"></zn-picker>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">支付金额</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写支付金额"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">确认金额</text>
									<view class="item-input">
										<input
											type="text"
											placeholder="请填写确认金额"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label item-textarea-label">备注信息</text>
									<view class="item-input">
										<textarea
										placeholder="请填写备注(选填)"
										class="item-textarea"
										:auto-height="true"/>
									</view>
								</view>
								<view class="item-view-upload">
									<view class="label">上传附件（选填）</view>
									<zn-upload
										@upload-success="handleUploadSuccess"
										@delete-image="handleDeleteImage"></zn-upload>
									<view class="tip">
										您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
									</view>
								</view>
							</view>
							<view class="button-wrapper">
								<view class="button">确认支付</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view class="swiper-item-wrapper" scroll-y>
							<view class="content-view">
								<view class="title-view">
									<view>
										<text class="line"></text>
										<text class="title">支付信息</text>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">支付金额</text>
									<view class="item-input">
										<input
											type="digit"
											placeholder="请填写支付金额"
											v-model.trim="offline.groupPayAmount"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label">确认金额</text>
									<view class="item-input">
										<input
											type="digit"
											placeholder="请填写确认金额"
											v-model.trim="offline.groupPayAmountConfirmed"/>
									</view>
								</view>
								<view class="item-view">
									<text class="item-label item-textarea-label">备注信息</text>
									<view class="item-input">
										<textarea
											v-model="offline.remark"
											placeholder="请填写备注(选填)"
											class="item-textarea"
											:maxlength="120"
											:auto-height="true"/>
									</view>
								</view>
								<view class="item-view-upload">
									<view class="label">上传附件（选填）</view>
									<zn-upload
										v-model="offline.imageList"
										@upload-success="handleUploadSuccess"
										@delete-image="handleDeleteImage"></zn-upload>
									<view class="tip">
										您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
									</view>
								</view>
							</view>
							<view class="button-wrapper">
								<view class="button" @click="offlineSubmit">确认支付</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view> -->
	</view>
</template>

<script>
	import znPicker from '../../../../components/zn-picker.vue'
	import znUpload from '../../../../components/zn-upload.vue'
	import znAddressPicker from '../../../../components/zn-address-picker.vue'
	
	export default {
		name: 'select-payment',
		components: {
			znPicker,
			znUpload,
			znAddressPicker
		},
		data() {
			return {
				token: this.$store.state.token,
				slaveOrderId: '',
				navList: [
					{
						label: '线上支付'
					},
					{
						label: '线下支付'
					}
				],
				swiperIndex: 0,
				addressPickerValue: [],
				pickerData: [ //TODO 删除
					[{label: '上海', value: 'shanghai'}, {label: '江苏', value: 'jiangsu'}, {label: '浙江', value: '浙江'}],
					[{label: '南京', value: 'nanjing'}, {label: '苏州', value: 'suzhou'},{label: '无锡', value: 'wuxi'}],
					[{label: '姑苏区', value: 'gusu'}, {label: '园区', value: 'yuanqu'},{label: '虎丘区', value: 'huqiu'}]
				],
				pickerValue: [],
				offline: {
					groupPayAmount: '',
					groupPayAmountConfirmed: '',
					remark: '',
					imageList: []
				}
			}
		},
		computed: {
			marginLeft() {
				return uni.upx2px(100 + 375 * this.swiperIndex) + 'px'
			}
		},
		onLoad(option) {
			this.slaveOrderId = option.slaveOrderId;
			this.slaveOrderNo = option.slaveOrderNo;
			this.getGroupPayAmount();
		},
		methods: {
			handleNavClick(index) { //导航栏tab点击
				this.swiperIndex = index;
			},
			handlePickerChange(pickerObj) {
				console.log(JSON.stringify(pickerObj));
			},
			swiperChange(event) { //event.detail: {current: 1, currentItemId: "", source: "touch"}
				const currentIndex = event.detail.current;
				if(!currentIndex && currentIndex !== 0) {
					return false
				}
				this.swiperIndex = event.detail.current;
				console.log(event.detail)
			},
			handleSwiperAnimationFinish(event) {

			},
			handleAddressPickerChange(pickerObj) { //地址选择器选项更改事件
				
			},
			handleAddressPickerConfirm(pickerObj) { //处理地址选择器确定事件
				
			},
			handleUploadSuccess(imageArr) { //图片上传成功

			},
			handleDeleteImage(imageArr) { //删除图片
			
			},
			getGroupPayAmount() { //获取集团支付总额
				const params = {
					token: this.token,
					order_no: this.slaveOrderNo
				}
				this.$api.groupOrderApi.orderReportCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							this.offline.groupPayAmount = result.response.count;
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
			},
			offlineSubmit() { //线下支付
				const params = {
					token: this.token,
					attachments: this.offline.imageList,
					group_pay_amount: this.offline.groupPayAmount,
					payment_method: 'GROUP_PAY_OFF_LINE'
				}
				if(parseFloat(this.offline.groupPayAmount) !== parseFloat(this.offline.groupPayAmountConfirmed)) {
					uni.showToast({
						title: '两次输入金额不一致',
						icon: 'none'
					})
					return false
				}
				if(this.offline.imageList.length === 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return false
				}
				params.attachments = this.offline.imageList.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				})
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.groupOrderApi.slaveOrderOfflinePay(params, this.slaveOrderId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '支付成功',
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.select-payment-wrapper {
		height: 100%;
		.content {
			display: flex;
			flex-direction: column;
			height: 100%;
			.nav-bar-view {
				position: relative;
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				background: #fff;
				font-size: 32upx;
				color: #666;
				border-bottom: 1px solid #eee;
				.nav-bar {
					display: flex;
					view {
						width: 50%;
						text-align: center;
					}
					.active {
						color: $uni-color-primary;
					}
				}
				.line {
					position: absolute;
					left: 100upx;
					bottom: 0;
					width: 180upx;
					height: 6upx;
					border-radius: 3px;
					background: $uni-color-primary;
					transition: all .5s ease;
				}
			}
			.swiper-wrapper {
				flex-grow: 1;
				height: calc(100% - 88upx);
				font-size: 28upx;
				swiper {
					height: 100%;
				}
				.swiper-item-wrapper {
					height: 100%;
					.content-view {
						margin-top: 20upx;
						padding: 10upx 30upx;
						background: #fff;
						.title-view {
							display: flex;
							justify-content: space-between;
							font-size: 32upx;
							color: #333;
							font-weight: 700;
							padding-top: 30upx;
							padding-bottom: 30upx;
							border-bottom: 1px solid #eee;
							.add-btn {
								display: flex;
								align-items: center;
								font-weight: 400;
								font-size: 28upx;
								color: $uni-color-primary;
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
								switch {
									float: right;
								}
							}
							.add-icon {
								display: flex;
								align-items: center;
								padding-left: 30upx;
								color: $uni-color-primary;
								border-left: 1px solid #eee;
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
						}
						.item-view-upload {
							padding-top: 20upx;
						}
						.tip {
							font-size: 20upx;
							color: #999;
							line-height: 30upx;
							padding-bottom: 20upx;
						}
					}
					.button-wrapper {
						width: 100%;
						padding: 30upx;
						box-sizing: border-box;
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
			}
		}
	}
</style>
