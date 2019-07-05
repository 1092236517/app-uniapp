<template>
	<view class="confirm-webprice-wrapper">
		<view class="main">
			<view class="content">
				<view class="steps-view">
					<zn-steps
						:steps="steps"
						:currentStep="currentStep"></zn-steps>			
				</view>
				<view class="accordion-view">
					<zn-accordion>
						<template slot="header">
							<view class="iconfont header">&#xe63e;</view>
						</template>
						<view class="content">
							<zn-timeline :timelineArr="timelineArr"></zn-timeline>
						</view>
					</zn-accordion>
				</view>
				<view class="item-wrapper">
                    <view class="item-header">
                    	<view class="title-view">
                    		<text class="line"></text>
                    		<text class="title">项目相关信息</text>
                    	</view>
                    	<!-- <view class="iconfont icon">&#xe63e;</view> -->
                    </view>
                    <view class="item-content">
                    	<view class="desc-content">
                    		<view class="desc">
                    			报价参考网址：<text class="desc-text">{{ webPriceReferenceText }}</text>
                    		</view>
                    		<view class="desc">
                    			报价参考地： <text class="desc-text">{{ referenceLocation }}</text>
                    		</view>
                    		<view class="desc">
                    			支付方式：<text class="desc-text">{{ paymentType }}</text>
                    		</view>
                    		<view class="desc">
                    			订价日期：<text class="desc-text">{{ date }}</text>
                    		</view>
                    		<view class="receive-goods-view">
                    			<text>收货时间</text>
                    			<view class="picker-view">
                    				<zn-date-picker
                    					v-model="receiveGoodsDatePickerValue"
                    					:disabled="isDisabled"></zn-date-picker>
                    			</view>
                    		</view>
                    		<template v-if="slaveOrderStatus === 'WAIT_SIGN'">
                    			<view class="item-view-upload">
                    				<view class="label">上传附件</view>
                    				<zn-upload
                    					v-model="imageList"
                    					@upload-success="handleUploadSuccess"
                    					@delete-image="handleDeleteImage"></zn-upload>
                    				<view class="tip">
                    					您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
                    				</view>
                    			</view>
                    		</template>
                    	</view>
                    </view>
				</view>
				<view class="item-wrapper" v-for="(item, index) in slaveOrderConfigList" :key="index">
                    <view class="item-header" @click="foldChange(item)">
                    	<view class="title-view">
                    		<text class="line"></text>
                    		<text class="title">参数详情 ({{ index + 1 }})</text>
                    	</view>
                    	<view class="iconfont icon">&#xe63e;</view>
                    </view>
                    <view class="item-content" v-if="!item.isFold">
                    	<view class="desc-content">
                    		<view class="desc">
                    			<text class="label">产品名</text>
                    			<input
                    				type="text"
                    				v-model="item.name"
                    				:disabled="isDisabled" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">直径（mm）</text>
                    			<input
                    				type="text"
                    				v-model="item.diameter"
                    				:disabled="isDisabled" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">数量（吨）</text>
                    			<input
                    				type="text"
                    				v-model="item.count"
                    				:disabled="isDisabled" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">抗震需求</text>
                    			<view class="picker-view">
                    				<zn-picker
                    					v-model="item.isSeismic"
                    					:pickerValueMulArray="selectRange"
                    					placeholder="请选择抗震与否"
                    					:disabled="isDisabled"></zn-picker>
                    			</view>
                    		</view>
                    		<view class="desc">
                    			<text class="label">长度（米）</text>
                    			<view class="picker-view">
                    				<zn-picker
                    					v-model="item.length"
                    					:pickerValueMulArray="lengthSelectRange"
                    					placeholder="请选择长度"
                    					:disabled="isDisabled"></zn-picker>
                    			</view>
                    		</view>
                    		<view class="desc">
                    			<text class="label">网上标价（元）</text>
                    			<input
                    				type="digit"
                    				placeholder="请填写价格"
                    				v-model="item.webPrice"
                    				:disabled="canEdit" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">总额（元）</text><text class="desc-text">{{ item.groupTotalMoney }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">备注</text>
                    			<input
                    				type="text"
                    				:placeholder="isDisabled ? '' : '请填写备注'"
                    				v-model="item.remark"
                    				:disabled="isDisabled" />
                    		</view>
                    	</view>
                    </view>
				</view>
			</view>
		</view>
		<view class="button-wrapper" v-if="slaveOrderStatus === 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY'">
			<view class="button button-reject" @click="reject" v-if="slaveOrderDetailAuthObj.rejectBtn.show">驳回</view>
			<view class="button" @click="approve" v-if="slaveOrderDetailAuthObj.approveBtn.show">确认</view>
		</view>
		<view class="button-wrapper" v-if="slaveOrderStatus === 'WAIT_SIGN'">
			<view class="button button-receive-goods" @click="confirmReceiveGoods" v-if="slaveOrderDetailAuthObj.confirmReceiveGoodsBtn.show">确认收货</view>
		</view>
	</view>
</template>

<script>
	import znSteps from '../../../../../components/zn-steps.vue'
	import znAccordion from '../../../../../components/zn-accordion.vue'
	import znTimeline from '../../../../../components/zn-timeline.vue'
	import znDatePicker from '../../../../../components/zn-date-picker.vue'
	import znUpload from '../../../../../components/zn-upload.vue'
	import znPicker from '../../../../../components/zn-picker.vue'
	import dayjs from 'dayjs'
	
	const webPriceReferenceText = {
		XB: '西本网',
		'MY_STEEL': '我的钢铁'
	}
	export default {
		name: 'slave-order-detail-branch',
		components: {
			znSteps,
			znAccordion,
			znTimeline,
			znDatePicker,
			znUpload,
			znPicker
		},
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: '',
				selectRange: [
					[
						{
							label: '抗震',
							value: '1'
						},
						{
							label: '不抗震',
							value: '0'
						}
					]
				],
				lengthSelectRange: [
					[
						{
							label: 9,
							value: '9'
						},
						{
							label: 12,
							value: '12'
						},
						{
							label: '无需求',
							value: '0'
						}
					]
				],
				steps: [],
				currentStep: 0,
				timelineArr: [],
				webPriceReference: '',
				webPriceReferenceText: '',
				referenceLocation: '',
				paymentType: '',
				date: '',
				datePickerValue: '',
				slaveOrderConfigList: [],
				slaveOrderStatus: '',
				imageList: [],
				receiveGoodsDatePickerValue: '',
                slaveOrderDetailAuthObj: {
                    confirmReceiveGoodsBtn: {
                        chName: '签收',
                        show: false
                    },
                    approveBtn: {
                        chName: '同意',
                        show: false
                    },
                    rejectBtn: {
                        chName: '驳回',
                        show: false
                    }
                }
			}
		},
		computed: {
			isDisabled() {
				let isDisabled = true;
				if(this.slaveOrderStatus === 'WAIT_SIGN') {
					isDisabled = false;
				}
				return isDisabled
			},
			canEdit() { //能否编辑网价
				let canEdit = true;
				if(this.slaveOrderStatus === 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY') {
					canEdit = true;
				}
				return canEdit
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.slaveOrderId = option.slaveOrderId;
			this.slaveOrderNo = option.slaveOrderNo;
			this.getSlaveOrderProcess();
			this.getSlaveOrderProcessLog();
			this.getOrderDetail();
            this.getAuth();
		},
		methods: {
            foldChange(item) { //折叠、展开
                item.isFold = !item.isFold;
            },
			handleUploadSuccess(imageArr) { //图片上传成功
				this.attachments = imageArr.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				})
			},
			handleDeleteImage(imageArr) { //删除图片
				this.attachments = imageArr.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				})
			},
			/**
			 * 获取当前步状态的类名
			 * @param  {Number} index   当前循环项的index
			 * @param  {String} status  当前循环项的状态
			 * @return {String}         当前循环项的类名
			 */
			getStepStatusClass(index, status) {
				let statusClass = '';
				if(status === 'CHECK_REJECT' || status === 'STATUS_BRANCH_CONFIRM_REJECT') {
					statusClass = 'step-is-error';
					return statusClass
				}
				if(this.currentStep > index + 1) {
					statusClass = 'step-is-finish';
				} else if (this.currentStep === index + 1) {
					statusClass = 'step-is-active';
				} else {
					statusClass ='step-is-wait';
				}
				return statusClass
			},
			getSlaveOrderProcess() { //获取批次订单进度条
				const params = {
					token: this.token,
					slave_order_id: this.slaveOrderId,
					process_type: 'SLAVE_ORDER'
				}
				this.$api.branchOrderApi.slaveOrderProcess(params)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const steps = result.response.processes;
							this.currentStep = result.response.step;
							this.steps = steps.map((item, index) => {
								let element = {};
								element.desc = item.title;
								element.statusClass = this.getStepStatusClass(index, item.status);
								return element
							})
						} else {
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
			getSlaveOrderProcessLog() { //获取批次订单操作日志
				const params = {
					token: this.token
				}
				this.$api.branchOrderApi.slaveOrderLogList(params, this.slaveOrderNo)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const listLength = result.response.length;
							let logList = result.response.map((item, index) => {
								let element = {
									demandReleaser: item.demand_submitting_name || '--',
									releaseTime: item.created_at || '--',
									approver: item.demand_submitter || '--',
									approveTime: item.updated_at || '--',
									duration: item.format_diachronic || '--',
									remark: item.remarks || '--',
									log: item.demand_desc,
									isActive: index === listLength - 1
								}
								if(item.demand_status == 'STATUS_BRANCH_CONFIRM_REJECT'){
									element.statusText = '不通过';
								}else if(item.demand_status == 'FINISHED'){
									element.statusText = '已完成';
								}else{
									element.statusText = '通过';
								}
								return element
							})
							this.timelineArr = logList.reverse();
						} else {
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
			getOrderDetail() { //获取订单详情
				const params = {
					token: this.token
				}
				this.$api.branchOrderApi.slaveOrderDetail(params, this.slaveOrderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							this.webPriceReference = result.response.quoted_price_website;
							this.webPriceReferenceText = webPriceReferenceText[result.response.master_order.quoted_price_website];
							this.referenceLocation = result.response.reference_address;
							this.date = result.response.quotation_time || '';
							this.paymentType = result.response.pay_description;
							this.slaveOrderStatus = result.response.status;
							this.receiveGoodsDatePickerValue = result.response.receive_time || '';
							this.slaveOrderConfigList = result.response.get_slave_order_configures.map((item, index) => {
								const element = {
									id: item.id,
									name: item.brand_name,
									diameter: item.diameter,
									count: item.num,
									groupTotalMoney: item.group_total_money || '--',
									remark: item.remark,
									webPrice: item.webPrice,
									supplierTotalMoney: item.supplier_total_money,
									groupPrice: item.group_price,
                                    isFold: true
								}
								const seismicIndex = this.selectRange[0].findIndex(select => select.value == item.is_seismic); //是否抗震的index
								const lengthIndex = this.lengthSelectRange[0].findIndex(length => length.value == item.length); //长度的index
								element.isSeismic = [seismicIndex];
								element.length = [lengthIndex];
								return element
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
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			handleDatePickerConfirm(pickerObj) { //日期选择器确定
				const { date } = pickerObj;
			},
			approve() { //同意
				const params = {
					token: this.token,
					status: 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY'
				}
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.branchOrderApi.slaveOrderCheck(params, this.slaveOrderId)
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
			reject() { //拒绝
				uni.navigateTo({
					url: `/pages/branch/order/slave-order/reject/reject?slaveOrderId=${this.slaveOrderId}`
				})
			},
			confirmReceiveGoods() { //确认收货
				const params = {
					token: this.token,
					actual_receive_time: dayjs(this.receiveGoodsDatePickerValue).format('YYYY-MM-DD HH:mm:ss')
				}
				const spec = this.slaveOrderConfigList.map((item, index) => {
					const element = {
						id: item.id,
						brand_name: item.name,
						diameter: item.diameter,
						num: item.count,
						length: item.length,
						group_total_money: item.groupTotalMoney,
						remark: item.remark,
						webPrice: item.webPrice,
						supplier_total_money: item.supplierTotalMoney,
						group_price: item.groupPrice
					}
					const seismicIndex = item.isSeismic[0];
					const lengthIndex = item.length[0];
					element.is_seismic = this.selectRange[0][seismicIndex]['value'];
					element.length = this.lengthSelectRange[0][lengthIndex]['value'];
					return element
				});
				if(this.imageList.length === 0) {
					uni.showToast({
						title: '请上传附件',
						icon: 'none'
					})
					return false
				}
				params.attachments = this.imageList.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				});
				params.spec = JSON.stringify(spec);
				this.$api.branchOrderApi.slaveOrderSign(params, this.slaveOrderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							uni.showToast({
								title: '操作成功！',
								icon: 'success'
							})
							uni.switchTab({
								url: '/pages/tabBar/joint-list/joint-list'
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
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
            getAuth() { //获取权限
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(orderListPermissionObj, this.slaveOrderDetailAuthObj);
            }
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.confirm-webprice-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.content {
				padding-bottom: 150upx;
				.steps-view {
					background: #fff;
					padding: 10upx 30upx;
				}
				.accordion-view {
					.header {
						background: #fff;
						height: 50upx;
						line-height: 50upx;
						text-align: center;
						border-top: 1px solid #E6E6E6;
						color: #999;				
					}
					.content {
						padding: 0 30upx;
					}
				}
				.item-wrapper {
					background: #fff;
					padding: 10upx 30upx;
					margin-top: 20upx;
					.item-header {
						display: flex;
						justify-content: space-between;
						font-size: 32upx;
						color: #333;
						font-weight: 700;
						padding-top: 30upx;
						padding-bottom: 30upx;
						border-bottom: 1px solid #eee;
						.title-view {
							display: flex;
							align-items: center;
						}
						.line {
							display: inline-block;
							width: 6upx;
							height: 32upx;
							margin-right: 20upx;
							border-radius: 3upx;
							vertical-align: middle;
							background: $uni-color-primary;
						}
						.icon {
							font-weight: 400;
						}
					}
					.item-content {
						padding-top: 20upx;
						.desc-content {
							line-height: 56upx;
							font-size: 28upx;
							color: #999;
							overflow: hidden;
							.item-view {
								display: flex;
								padding-top: 20upx;
								padding-bottom: 20upx;
								border-bottom: 1px solid #eee;
								.item-label {
									display: flex;
									align-items: center;
									font-size: 26upx;
									min-width: 200upx;
									color: #666;
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
								.input-placeholder {
									color: $uni-text-color-placeholder;
								}
							}
							.desc {
								display: flex;
								text-overflow: ellipsis;
								white-space: nowrap;
								overflow: hidden;
								.desc-text {
									color: #666;
								}
								.label {
									display: inline-block;
									width: 200upx;
								}
								input {
									flex-grow: 1;
									color: #666;
								}
								.picker-view {
									flex-grow: 1;
								}
							}
							.receive-goods-view {
								display: flex;
								.picker-view {
									flex-grow: 1;
									padding-left: 30upx;
								}
							}
							.item-view-upload {
								.tip {
									color: #999;
									line-height: 36upx;
									font-size: 24upx;
								}
							}
						}
					}
				}
			}
		}
		.button-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			width: 100%;
			box-sizing: border-box;
			background: #eee;
			z-index: 10;
			.button {
				width: 50%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;				
			}
			.button-reject {
				background: #1F89E7;
			}
			.button-receive-goods {
				width: 100%;
			}
		}
	}
</style>
